import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { appointments, type SalonSettings } from "@/db/schema";
import { parseClosedWeekdays, timeToMinutes } from "./settings";

const ACTIVE = ["pending", "confirmed"] as const;

export type BusyInterval = { start: number; end: number; label: string };

/** Début et fin (en minutes) d'une prestation à partir de son heure de début. */
export function windowFor(time: string, minutes: number) {
  const start = timeToMinutes(time);
  return { start, end: start + minutes };
}

/**
 * Charge les créneaux occupés d'une journée en tenant compte de la DURÉE réelle
 * de chaque prestation, et pas seulement de son heure de début.
 * C'est ce qui empêche de placer deux clientes en même temps.
 */
export async function busyIntervals(
  date: string,
  settings: SalonSettings,
  excludeId?: string
): Promise<BusyInterval[]> {
  const rows = await db
    .select({
      id: appointments.id,
      time: appointments.time,
      minutes: appointments.minutes,
      service: appointments.service,
    })
    .from(appointments)
    .where(
      excludeId
        ? and(
            eq(appointments.date, date),
            inArray(appointments.status, [...ACTIVE]),
            ne(appointments.id, excludeId)
          )
        : and(eq(appointments.date, date), inArray(appointments.status, [...ACTIVE]))
    );

  const buffer = settings.bufferMinutes;

  return rows.map((r) => {
    const { start, end } = windowFor(r.time, r.minutes);
    return { start, end: end + buffer, label: r.service };
  });
}

/** Nombre de postes occupés pendant la fenêtre envisagée. */
export function concurrencyAt(busy: BusyInterval[], start: number, end: number) {
  return busy.filter((b) => b.start < end && start < b.end).length;
}

/** Indique si une nouvelle prestation tient dans le planning, avec la raison en français. */
export function canFit(
  busy: BusyInterval[],
  start: number,
  end: number,
  settings: SalonSettings
): { ok: boolean; reason?: string; used: number; max: number } {
  const used = concurrencyAt(busy, start, end);
  const max = settings.maxParallel;

  if (used >= max) {
    return {
      ok: false,
      reason:
        max === 1
          ? "Ce créneau vient d'être réservé. Merci de choisir un autre horaire."
          : `Ce créneau est complet (${used}/${max} postes occupés). Merci de choisir un autre horaire.`,
      used,
      max,
    };
  }

  return { ok: true, used, max };
}

/** Jour de fermeture hebdomadaire. */
export function dayIsOpen(date: string, settings: SalonSettings) {
  const d = new Date(`${date}T00:00:00`).getDay();
  return !parseClosedWeekdays(settings.closedWeekdays).includes(d);
}

/** La prestation se termine-t-elle avant la fermeture du salon ? */
export function slotIsWithinHours(time: string, minutes: number, settings: SalonSettings) {
  const { start, end } = windowFor(time, minutes);
  return start >= settings.openMinutes && end <= settings.closeMinutes;
}
