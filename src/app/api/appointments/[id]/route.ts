import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["pending", "confirmed", "done", "cancelled"]),
});

type Ctx = { params: Promise<{ id: string }> };

const UNAUTHORIZED = NextResponse.json(
  { message: "Accès réservé à l'équipe du salon." },
  { status: 401 }
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function badId() {
  return NextResponse.json({ message: "Identifiant invalide." }, { status: 400 });
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    if (!(await isAuthenticated())) return UNAUTHORIZED;
    const { id } = await ctx.params;
    if (!UUID_RE.test(id)) return badId();
    const json = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ message: "Statut invalide." }, { status: 400 });
    }

    const updated = await db
      .update(appointments)
      .set({ status: parsed.data.status })
      .where(eq(appointments.id, id))
      .returning({ id: appointments.id });

    if (updated.length === 0) {
      return NextResponse.json({ message: "Rendez-vous introuvable." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    if (!(await isAuthenticated())) return UNAUTHORIZED;
    const { id } = await ctx.params;
    if (!UUID_RE.test(id)) return badId();
    const deleted = await db
      .delete(appointments)
      .where(eq(appointments.id, id))
      .returning({ id: appointments.id });

    if (deleted.length === 0) {
      return NextResponse.json({ message: "Rendez-vous introuvable." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
