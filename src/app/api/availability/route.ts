import { NextResponse } from "next/server";
import {
  buildSlots,
  getSettings,
  minutesToTime,
  timeToMinutes,
} from "@/lib/settings";
import {
  busyIntervals,
  concurrencyAt,
  dayIsOpen,
  slotIsWithinHours,
  windowFor,
} from "@/lib/conflicts";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date") ?? "";
    const minutes = Math.max(15, Math.min(600, Number(url.searchParams.get("minutes") ?? 60) || 60));

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ message: "Paramètre date invalide." }, { status: 400 });
    }

    const settings = await getSettings();

    // Jour de fermeture hebdomadaire.
    if (!dayIsOpen(date, settings)) {
      return NextResponse.json({
        date,
        closed: true,
        maxParallel: settings.maxParallel,
        openLabel: `${minutesToTime(settings.openMinutes)} – ${minutesToTime(settings.closeMinutes)}`,
        slots: [],
      });
    }

    const busy = await busyIntervals(date, settings);
    const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" });
    const isToday = date === todayKey;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const slots = buildSlots(settings).map((slot) => {
      const start = timeToMinutes(slot);
      const { end } = windowFor(slot, minutes);

      if (!slotIsWithinHours(slot, minutes, settings)) {
        return { time: slot, status: "closed" as const, used: 0, max: settings.maxParallel };
      }
      if (isToday && start <= nowMin + 30) {
        return { time: slot, status: "past" as const, used: 0, max: settings.maxParallel };
      }

      const used = concurrencyAt(busy, start, end);
      if (used >= settings.maxParallel) {
        return { time: slot, status: "full" as const, used, max: settings.maxParallel };
      }
      if (used + 1 === settings.maxParallel) {
        return { time: slot, status: "last" as const, used, max: settings.maxParallel };
      }
      return { time: slot, status: "free" as const, used, max: settings.maxParallel };
    });

    return NextResponse.json({
      date,
      closed: false,
      maxParallel: settings.maxParallel,
      openLabel: `${minutesToTime(settings.openMinutes)} – ${minutesToTime(settings.closeMinutes)}`,
      slots,
    });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
