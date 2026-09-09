"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, Check, CheckCheck, Hourglass, Loader2, MessageCircle, Trash2, Undo2, X } from "lucide-react";
import type { AdminRow } from "@/app/admin/page";
import { buildReminderText, clientWhatsAppLink } from "@/lib/booking";

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "border-amber-300 bg-amber-50 text-amber-800" },
  confirmed: { label: "Confirmée", cls: "border-emerald-300 bg-emerald-50 text-emerald-800" },
  done: { label: "Terminée", cls: "border-sky-300 bg-sky-50 text-sky-800" },
  cancelled: { label: "Annulée", cls: "border-rose-200 bg-rose-50 text-rose-600" },
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminTable({ rows }: { rows: AdminRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function update(id: string, status: string) {
    setBusy(id + status);
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Supprimer définitivement ce rendez-vous ?")) return;
    setBusy(id + "delete");
    try {
      await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-espresso/20 bg-white/60 p-14 text-center">
        <Hourglass className="mx-auto h-8 w-8 text-bronze" />
        <p className="mt-4 font-serif text-2xl italic">Aucune demande pour le moment</p>
        <p className="mt-2 text-sm text-espresso/55">
          Les réservations effectuées depuis le site apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-3xl border border-espresso/8 bg-white shadow-[0_24px_60px_-40px_rgba(60,45,33,0.45)]">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b border-espresso/10 text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/45">
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Prestation</th>
            <th className="px-6 py-4">Date & heure</th>
            <th className="px-6 py-4">Message</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const st = STATUS[r.status] ?? STATUS.pending;
            return (
              <tr key={r.id} className="border-b border-espresso/6 align-top transition-colors last:border-0 hover:bg-cream/40">
                <td className="px-6 py-5">
                  <p className="font-semibold text-espresso">{r.name}</p>
                  <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="text-xs text-bronze hover:underline">
                    {r.phone}
                  </a>
                  {r.reference && (
                    <p className="mt-1 font-mono text-[10px] tracking-widest text-espresso/35">
                      {r.reference}
                    </p>
                  )}
                </td>
                <td className="px-6 py-5 text-espresso/80">{r.service}</td>
                <td className="px-6 py-5">
                  <p className="flex items-center gap-1.5 text-espresso/80">
                    <CalendarDays className="h-3.5 w-3.5 text-bronze" />
                    {formatDate(r.date)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-espresso/55">
                    <Clock className="h-3.5 w-3.5 text-bronze" />
                    {r.time}
                  </p>
                </td>
                <td className="max-w-[220px] px-6 py-5 text-xs leading-relaxed text-espresso/60">
                  {r.notes || <span className="italic text-espresso/30">—</span>}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${st.cls}`}
                  >
                    {st.label}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    {busy && busy.startsWith(r.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin text-bronze" />
                    ) : (
                      <>
                        {r.status === "pending" && (
                          <button
                            onClick={() => update(r.id, "confirmed")}
                            title="Confirmer"
                            aria-label="Confirmer"
                            className="grid h-8 w-8 place-items-center rounded-full border border-emerald-300 text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {r.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => update(r.id, "done")}
                              title="Marquer terminée"
                              aria-label="Marquer terminée"
                              className="grid h-8 w-8 place-items-center rounded-full border border-sky-300 text-sky-700 transition-colors hover:bg-sky-600 hover:text-white"
                            >
                              <CheckCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => update(r.id, "pending")}
                              title="Remettre en attente"
                              aria-label="Remettre en attente"
                              className="grid h-8 w-8 place-items-center rounded-full border border-amber-300 text-amber-600 transition-colors hover:bg-amber-500 hover:text-white"
                            >
                              <Undo2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {r.status !== "cancelled" && r.status !== "done" && (
                          <button
                            onClick={() => update(r.id, "cancelled")}
                            title="Annuler"
                            aria-label="Annuler"
                            className="grid h-8 w-8 place-items-center rounded-full border border-rose-300 text-rose-600 transition-colors hover:bg-rose-500 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <a
                          href={clientWhatsAppLink(
                            r.phone,
                            buildReminderText({
                              name: r.name,
                              service: r.service,
                              date: r.date,
                              time: r.time,
                              reference: r.reference,
                            })
                          )}
                          target="_blank"
                          rel="noreferrer"
                          title="Rappel WhatsApp"
                          aria-label="Envoyer un rappel WhatsApp"
                          className="grid h-8 w-8 place-items-center rounded-full border border-emerald-300 text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => remove(r.id)}
                          title="Supprimer"
                          aria-label="Supprimer"
                          className="grid h-8 w-8 place-items-center rounded-full border border-espresso/15 text-espresso/50 transition-colors hover:border-rose-400 hover:bg-rose-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
