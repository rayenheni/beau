import { NextResponse } from "next/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { appointments } from "@/db/schema";

const schema = z.object({
  reference: z.string().trim().min(4, "Référence invalide."),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide."),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Demande invalide." },
        { status: 400 }
      );
    }

    const digits = parsed.data.phone.replace(/[^0-9]/g, "").slice(-8);

    const updated = await db
      .update(appointments)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(appointments.reference, parsed.data.reference.toUpperCase()),
          inArray(appointments.status, ["pending", "confirmed"]),
          sql`regexp_replace(${appointments.phone}, '[^0-9]', '', 'g') LIKE ${"%" + digits}`
        )
      )
      .returning({ reference: appointments.reference });

    if (updated.length === 0) {
      return NextResponse.json(
        { message: "Aucun rendez-vous actif ne correspond à ces informations." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, reference: updated[0].reference });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
