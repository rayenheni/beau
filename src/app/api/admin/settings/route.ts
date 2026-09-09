import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { salonSettings } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Accès réservé à l'équipe." }, { status: 401 });
  }
  return NextResponse.json({ settings: await getSettings() });
}

const schema = z.object({
  maxParallel: z.number().int().min(1).max(20),
  bufferMinutes: z.number().int().min(0).max(120),
  openMinutes: z.number().int().min(0).max(1439),
  closeMinutes: z.number().int().min(1).max(1440),
  closedWeekdays: z.string().max(40),
  notifyEmail: z.union([z.string().email("E-mail invalide."), z.literal("")]).optional(),
});

export async function PATCH(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Accès réservé à l'équipe." }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Paramètres invalides." },
      { status: 400 }
    );
  }
  const d = parsed.data;
  if (d.closeMinutes <= d.openMinutes) {
    return NextResponse.json(
      { message: "L'heure de fermeture doit être après l'heure d'ouverture." },
      { status: 400 }
    );
  }

  await getSettings(); // garantit la présence de la ligne id = 1

  await db
    .update(salonSettings)
    .set({
      maxParallel: d.maxParallel,
      bufferMinutes: d.bufferMinutes,
      openMinutes: d.openMinutes,
      closeMinutes: d.closeMinutes,
      closedWeekdays: d.closedWeekdays,
      notifyEmail: d.notifyEmail ? d.notifyEmail : null,
      updatedAt: new Date(),
    })
    .where(eq(salonSettings.id, 1));

  return NextResponse.json({ ok: true, settings: await getSettings() });
}
