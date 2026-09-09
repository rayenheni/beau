import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Hourglass,
  ListChecks,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { appointments, type Appointment } from "@/db/schema";
import AdminTable from "@/components/AdminTable";
import AdminExport from "@/components/AdminExport";
import LogoutButton from "@/components/LogoutButton";
import NotificationBell from "@/components/NotificationBell";
import SettingsForm from "@/components/SettingsForm";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { SALON } from "@/lib/salon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Espace Pro · Réservations — ${SALON.name}`,
  robots: { index: false, follow: false },
};

export type AdminRow = Omit<Appointment, "createdAt"> & { createdAt: string };

function statCards(annual: number) {
  return [
    { icon: ListChecks, label: "Total demandes", tone: "text-espresso" },
    { icon: Hourglass, label: "En attente", tone: "text-amber-600" },
    { icon: CalendarCheck, label: "Confirmées", tone: "text-emerald-700" },
    { icon: CheckCircle2, label: "Réalisées", tone: "text-sky-700" },
  ].map((c) => ({ ...c, amount: annual }));
}

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" });
  const weekAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  const [rows, settings, todayCount, pendingCount, monthAgg, topServices, cancels] =
    await Promise.all([
      db.select().from(appointments).orderBy(desc(appointments.createdAt)),
      getSettings(),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
        .where(eq(appointments.date, todayKey)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
        .where(inArray(appointments.status, ["pending"])),
      db
        .select({
          revenue: sql<number>`coalesce(sum(${appointments.priceValue}),0)::int`,
          done: sql<number>`count(*)::int`,
        })
        .from(appointments)
        .where(and(eq(appointments.status, "done"), gte(appointments.createdAt, new Date(weekAgo)))),
      db
        .select({
          service: appointments.service,
          count: sql<number>`count(*)::int`,
        })
        .from(appointments)
        .where(gte(appointments.createdAt, new Date(weekAgo)))
        .groupBy(appointments.service)
        .orderBy(desc(sql`count(*)`))
        .limit(4),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
        .where(eq(appointments.status, "cancelled")),
    ]);

  const data: AdminRow[] = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  const counts = {
    total: data.length,
    pending: pendingCount[0]?.count ?? 0,
    confirmed: data.filter((r) => r.status === "confirmed").length,
    done: data.filter((r) => r.status === "done").length,
    cancelled: cancels[0]?.count ?? 0,
    today: todayCount[0]?.count ?? 0,
  };

  const revenue = monthAgg[0]?.revenue ?? 0;
  const doneMonth = monthAgg[0]?.done ?? 0;
  const completionRate = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;
  const cancelRate = counts.total > 0 ? Math.round((counts.cancelled / counts.total) * 100) : 0;
  const averageBasket = doneMonth > 0 ? Math.round(revenue / doneMonth) : 0;

  const cards = [
    { icon: ListChecks, label: "Demandes totales", value: counts.total, tone: "text-espresso" },
    { icon: Hourglass, label: "En attente", value: counts.pending, tone: "text-amber-600" },
    { icon: CalendarCheck, label: "Confirmées", value: counts.confirmed, tone: "text-emerald-700" },
    { icon: CheckCircle2, label: "Réalisées", value: counts.done, tone: "text-sky-700" },
  ];

  void statCards;

  return (
    <main className="min-h-screen bg-ivory font-sans text-espresso">
      <header className="sticky top-0 z-40 border-b border-espresso/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4 md:px-10">
          <div>
            <p className="font-serif text-2xl font-medium italic">{SALON.shortName}</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-bronze">
              Espace pro · Planning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LogoutButton />
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-full border border-espresso/15 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:border-bronze hover:text-bronze sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              Site
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* KPI principaux */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-espresso/8 bg-white p-5 shadow-[0_16px_40px_-32px_rgba(60,45,33,0.45)]"
            >
              <c.icon className={`h-5 w-5 ${c.tone}`} />
              <p className="mt-3 font-serif text-4xl tracking-tight">{c.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-espresso/45">
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {/* Indicateurs d'activité */}
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-bronze/30 bg-bronze/8 p-5">
            <TrendingUp className="h-5 w-5 text-bronze" />
            <p className="mt-3 font-serif text-3xl tracking-tight text-bronze">{revenue} DT</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-espresso/50">
              CA réalisé (30 j)
            </p>
          </div>
          <div className="rounded-2xl border border-espresso/8 bg-white p-5">
            <Users className="h-5 w-5 text-espresso/60" />
            <p className="mt-3 font-serif text-3xl tracking-tight">{averageBasket} DT</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-espresso/45">
              Panier moyen
            </p>
          </div>
          <div className="rounded-2xl border border-espresso/8 bg-white p-5">
            <CalendarCheck className="h-5 w-5 text-emerald-700" />
            <p className="mt-3 font-serif text-3xl tracking-tight">{completionRate} %</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-espresso/45">
              Prestations honorées
            </p>
          </div>
          <div className="rounded-2xl border border-espresso/8 bg-white p-5">
            <XCircle className="h-5 w-5 text-rose-500" />
            <p className="mt-3 font-serif text-3xl tracking-tight">{cancelRate} %</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-espresso/45">
              Annulations
            </p>
          </div>
        </div>

        {/* Prestations les plus demandées */}
        {topServices.length > 0 && (
          <div className="mt-4 rounded-2xl border border-espresso/8 bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-espresso/45">
              Prestations les plus demandées (30 j)
            </p>
            <ul className="mt-4 space-y-3">
              {topServices.map((t) => {
                const max = topServices[0].count || 1;
                const pct = Math.round((t.count / max) * 100);
                return (
                  <li key={t.service}>
                    <div className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="truncate text-espresso/80">{t.service}</span>
                      <span className="shrink-0 font-bold text-espresso">{t.count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-espresso/8">
                      <div className="h-full rounded-full bg-bronze" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Planning du jour */}
        <div className="mt-6 rounded-2xl border border-espresso/8 bg-espresso p-6 text-ivory">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze-light">
                Aujourd&apos;hui
              </p>
              <p className="mt-1.5 font-serif text-2xl tracking-tight">
                {counts.today} {counts.today === 1 ? "cliente attendue" : "clientes attendues"}
              </p>
            </div>
            <p className="text-xs text-ivory/55">
              {settings.maxParallel} poste{settings.maxParallel > 1 ? "s" : ""} simultané
              {settings.maxParallel > 1 ? "s" : ""} · marge {settings.bufferMinutes} min ·
              horaires {String(Math.floor(settings.openMinutes / 60)).padStart(2, "0")}h –{" "}
              {String(Math.floor(settings.closeMinutes / 60)).padStart(2, "0")}h
            </p>
          </div>
        </div>

        <AdminExport rows={data} />

        {/* Tableau */}
        <div className="mt-8">
          <h1 className="font-serif text-3xl tracking-tight">
            Toutes les <span className="italic text-bronze">demandes</span>
          </h1>
          <p className="mt-2 text-sm text-espresso/55">
            Confirmez, terminez ou annulez les demandes reçues via le site.
          </p>
          <AdminTable rows={data} />
        </div>

        {/* Réglages */}
        <div className="mt-10">
          <SettingsForm
            initial={{
              maxParallel: settings.maxParallel,
              bufferMinutes: settings.bufferMinutes,
              openMinutes: settings.openMinutes,
              closeMinutes: settings.closeMinutes,
              closedWeekdays: settings.closedWeekdays,
              notifyEmail: settings.notifyEmail,
            }}
          />
        </div>
      </div>
    </main>
  );
}
