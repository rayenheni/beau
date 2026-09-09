import { NextResponse } from "next/server";
import { and, desc, eq, gt, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { appointments, notifications } from "@/db/schema";
import { SALON } from "@/lib/salon";
import { findService } from "@/lib/services";
import { getSettings } from "@/lib/settings";
import { busyIntervals, canFit, dayIsOpen, slotIsWithinHours, windowFor } from "@/lib/conflicts";
import { bookingAlertText, sendMail } from "@/lib/mailer";
import { formatFrDate } from "@/lib/booking";

const ALPHABET = "ACDEFGHJKLMNPQRTUVWXY34679";

function makeReference() {
  let out = "";
  for (let i = 0; i < 5; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return `${SALON.refPrefix}-${out}`;
}

const createSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom complet.").max(80, "Nom trop long."),
  phone: z
    .string()
    .trim()
    .min(8, "Numéro de téléphone invalide.")
    .max(24, "Numéro de téléphone invalide.")
    .regex(/^[+0-9().\-\s]+$/, "Numéro de téléphone invalide."),
  serviceId: z.string().trim().max(60).optional().nullable(),
  service: z.string().trim().min(2, "Veuillez choisir une prestation.").max(140),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Heure invalide."),
  notes: z.string().trim().max(600, "Message trop long.").optional(),
});

const RATE_LIMIT = 6;
const RATE_WINDOW = "10 minutes";

async function rateLimited(ip: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(
      and(
        eq(appointments.ip, ip),
        gt(appointments.createdAt, sql`now() - interval '${sql.raw(RATE_WINDOW)}'`)
      )
    );
  return (row?.count ?? 0) >= RATE_LIMIT;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";

    if (await rateLimited(ip)) {
      return NextResponse.json(
        {
          message:
            `Trop de demandes envoyées. Merci de patienter quelques minutes ou de nous appeler au ${SALON.phoneDisplay}.`,
        },
        { status: 429 }
      );
    }

    const json = await req.json().catch(() => null);
    if (!json) return NextResponse.json({ message: "Demande invalide." }, { status: 400 });

    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Demande invalide." },
        { status: 400 }
      );
    }
    const { name, phone, serviceId, service, date, time, notes } = parsed.data;

    const todayTz = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" });
    if (date < todayTz) {
      return NextResponse.json({ message: "Veuillez choisir une date à venir." }, { status: 400 });
    }

    const svc = findService(serviceId);
    const minutes = svc?.minutes ?? 60;
    const settings = await getSettings();

    // Jour de fermeture hebdomadaire.
    if (!dayIsOpen(date, settings)) {
      return NextResponse.json(
        { message: "Le salon est fermé ce jour-là. Merci de choisir un autre jour." },
        { status: 409 }
      );
    }

    // La prestation doit se terminer avant la fermeture.
    if (!slotIsWithinHours(time, minutes, settings)) {
      return NextResponse.json(
        {
          message:
            "Cette prestation se terminerait après la fermeture du salon. Merci de choisir un créneau plus tôt.",
        },
        { status: 409 }
      );
    }

    // Anti-débordement basé sur la durée réelle de la prestation.
    const busy = await busyIntervals(date, settings);
    const { start, end } = windowFor(time, minutes);
    const fit = canFit(busy, start, end, settings);
    if (!fit.ok) {
      return NextResponse.json({ message: fit.reason }, { status: 409 });
    }

    // Référence unique.
    let reference = makeReference();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await db
        .select({ id: appointments.id })
        .from(appointments)
        .where(eq(appointments.reference, reference))
        .limit(1);
      if (existing.length === 0) break;
      reference = makeReference();
    }

    const [created] = await db
      .insert(appointments)
      .values({
        reference,
        name,
        phone,
        service: svc?.name ?? service,
        serviceId: svc?.id ?? null,
        minutes,
        priceValue: svc?.priceValue ?? 0,
        date,
        time,
        notes: notes || null,
        ip,
      })
      .returning({ id: appointments.id, reference: appointments.reference });

    // Alerte interne pour l'équipe du salon.
    await db.insert(notifications).values({
      appointmentId: created.id,
      type: "new_booking",
      title: `Nouvelle demande — ${svc?.name ?? service}`,
      body: `${name} · ${formatFrDate(date)} à ${time} · ${phone}`,
    });

    const alertText = bookingAlertText({
      reference: created.reference,
      name,
      phone,
      service: svc?.name ?? service,
      date,
      time,
      minutes,
      notes,
    });

    const email = settings.notifyEmail ?? process.env.MAIL_TO;
    if (email) {
      await sendMail({
        subject: `Nouvelle réservation ${created.reference} — ${svc?.name ?? service}`,
        text: alertText,
      });
    }

    return NextResponse.json(
      { reference: created.reference, minutes, message: "Demande enregistrée." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Une erreur est survenue, veuillez réessayer ou nous appeler." },
      { status: 500 }
    );
  }
}

/** Consultation client : par référence ou par téléphone. */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const reference = url.searchParams.get("reference")?.trim().toUpperCase() ?? "";
    const phone = url.searchParams.get("phone")?.trim() ?? "";

    if (reference.length < 4 && phone.length < 6) {
      return NextResponse.json(
        { message: "Indiquez votre référence ou votre numéro de téléphone." },
        { status: 400 }
      );
    }

    const rows = await db
      .select({
        reference: appointments.reference,
        name: appointments.name,
        service: appointments.service,
        minutes: appointments.minutes,
        date: appointments.date,
        time: appointments.time,
        notes: appointments.notes,
        status: appointments.status,
      })
      .from(appointments)
      .where(
        reference.length >= 4
          ? eq(appointments.reference, reference)
          : or(
              eq(appointments.phone, phone),
              sql`regexp_replace(${appointments.phone}, '[^0-9]', '', 'g') LIKE ${
                "%" + phone.replace(/[^0-9]/g, "").slice(-8) || "%"
              }`
            )
      )
      .orderBy(desc(appointments.createdAt))
      .limit(20);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Aucune demande trouvée avec ces informations." },
        { status: 404 }
      );
    }
    return NextResponse.json({ appointments: rows });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
