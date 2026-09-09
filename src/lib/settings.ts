import { eq } from "drizzle-orm";
import { db } from "@/db";
import { salonSettings, type SalonSettings } from "@/db/schema";

export const DEFAULT_SETTINGS = {
  id: 1,
  maxParallel: 2,
  bufferMinutes: 10,
  openMinutes: 540,
  closeMinutes: 1140,
  closedWeekdays: "0",
  notifyEmail: null as string | null,
};

/** Lit les paramètres du salon, en créant la ligne par défaut si besoin. */
export async function getSettings(): Promise<SalonSettings> {
  const rows = await db.select().from(salonSettings).where(eq(salonSettings.id, 1)).limit(1);
  if (rows.length > 0) return rows[0];

  const [created] = await db
    .insert(salonSettings)
    .values(DEFAULT_SETTINGS)
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const again = await db.select().from(salonSettings).where(eq(salonSettings.id, 1)).limit(1);
  return again[0];
}

export function minutesToTime(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

export function parseClosedWeekdays(raw: string): number[] {
  return raw
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v >= 0 && v <= 6);
}

/** Grille des créneaux proposés à la réservation, selon les horaires du salon. */
export function buildSlots(settings: SalonSettings) {
  const step = 30;
  const slots: string[] = [];
  for (let t = settings.openMinutes; t <= settings.closeMinutes - step; t += step) {
    slots.push(minutesToTime(t));
  }
  return slots;
}
