import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  createToken,
  isAdminConfigured,
  isAuthenticated,
} from "@/lib/auth";

const schema = z.object({ password: z.string().min(1, "Mot de passe requis.") });

/**
 * Attributs du cookie de session selon le contexte :
 * - HTTPS (production Vercel, prévisualisation proxifiée, iframe) :
 *   SameSite=None + Secure + Partitioned (CHIPS). Sans cela, les navigateurs
 *   qui bloquent les cookies tiers jettent le cookie et la connexion semble
 *   ne pas aboutir (retour silencieux au login). Partitioned exige Secure.
 * - HTTP local (npm run dev sur localhost) : SameSite=Lax, sans Secure ni
 *   Partitioned (rejetés en HTTP).
 */
function cookieAttrs(req: Request) {
  const https =
    req.headers.get("x-forwarded-proto") === "https" ||
    process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: (https ? "none" : "lax") as "none" | "lax",
    secure: https,
    partitioned: https,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

/**
 * Vérification de session : permet à la page de connexion de confirmer que
 * le navigateur a bien accepté (et renvoie) le cookie, avant de naviguer.
 * Sans cela, un bloqueur de cookies tiers provoque un silencieux retour au login.
 */
export async function GET() {
  const authenticated = await isAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        message:
          "Espace pro non configuré : définissez la variable d'environnement ADMIN_PASSWORD sur le serveur.",
      },
      { status: 503 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Demande invalide." },
      { status: 400 }
    );
  }

  const expected = process.env.ADMIN_PASSWORD ?? "";
  const given = parsed.data.password;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(given, "utf8");
  const ok = a.length === b.length && (() => {
    try {
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  })();

  if (!ok) {
    // Petite pause pour freiner les tentatives de force brute.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ message: "Mot de passe incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createToken(), cookieAttrs(req));
  return res;
}

export async function DELETE(req: Request) {
  const res = NextResponse.json({ ok: true });
  // La suppression doit reprendre les mêmes attributs (sameSite/secure),
  // sinon le navigateur conserve le cookie.
  res.cookies.set(COOKIE_NAME, "", { ...cookieAttrs(req), maxAge: 0 });
  return res;
}
