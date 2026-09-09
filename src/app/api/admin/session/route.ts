import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { COOKIE_MAX_AGE, COOKIE_NAME, createToken, isAdminConfigured } from "@/lib/auth";

const schema = z.object({ password: z.string().min(1, "Mot de passe requis.") });

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
  res.cookies.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
