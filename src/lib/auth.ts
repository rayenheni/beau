import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "salon_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 heures

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Un mot de passe d'au moins 6 caractères doit être défini pour activer l'espace pro. */
export function isAdminConfigured() {
  return secret().length >= 6;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createToken() {
  const exp = Date.now() + COOKIE_MAX_AGE * 1000;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined | null) {
  if (!token || !isAdminConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expRaw, sig] = parts;
  const exp = Number(expRaw);
  if (role !== "admin" || !Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = sign(`${role}.${expRaw}`);
  if (expected.length !== sig.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"));
  } catch {
    return false;
  }
}

/** À utiliser dans les composants serveur et les route handlers. */
export async function isAuthenticated() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}
