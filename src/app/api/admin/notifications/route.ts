import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Accès réservé à l'équipe." }, { status: 401 });
  }

  const [rows, unread] = await Promise.all([
    db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(25),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(eq(notifications.read, 0)),
  ]);

  return NextResponse.json({ notifications: rows, unread: unread[0]?.count ?? 0 });
}

const patchSchema = z.object({ id: z.string().uuid().optional(), all: z.boolean().optional() });

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Accès réservé à l'équipe." }, { status: 401 });
  }

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ message: "Demande invalide." }, { status: 400 });
  }

  if (parsed.data.all) {
    await db.update(notifications).set({ read: 1 }).where(eq(notifications.read, 0));
  } else if (parsed.data.id) {
    await db.update(notifications).set({ read: 1 }).where(eq(notifications.id, parsed.data.id));
  }

  return NextResponse.json({ ok: true });
}
