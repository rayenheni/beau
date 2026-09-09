"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, Loader2, Search, Trash2, X } from "lucide-react";
import { SALON, formatFrDate } from "@/lib/booking";
import { EASE } from "./Reveal";
import { toast } from "./Toast";

type Row = {
  reference: string;
  service: string;
  date: string;
  time: string;
  status: string;
  notes: string | null;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "En attente de confirmation", cls: "border-amber-300 bg-amber-50 text-amber-800" },
  confirmed: { label: "Confirmée", cls: "border-emerald-300 bg-emerald-50 text-emerald-800" },
  done: { label: "Réalisée", cls: "border-sky-300 bg-sky-50 text-sky-800" },
  cancelled: { label: "Annulée", cls: "border-rose-200 bg-rose-50 text-rose-600" },
};

export default function MyBookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"reference" | "phone">("reference");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRows(null);
    try {
      const param = mode === "reference" ? `reference=${encodeURIComponent(value)}` : `phone=${encodeURIComponent(value)}`;
      const res = await fetch(`/api/appointments?${param}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Recherche impossible.");
      setRows(data.appointments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recherche impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelRow(row: Row) {
    if (!window.confirm(`Annuler votre rendez-vous du ${formatFrDate(row.date)} à ${row.time} ?`)) return;
    setLoading(true);
    try {
      const digits = value.replace(/[^0-9]/g, "");
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: row.reference, phone: digits || row.reference }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404 && mode === "reference") {
          throw new Error("Pour annuler, renseignez aussi votre numéro de téléphone.");
        }
        throw new Error(data.message || "Annulation impossible.");
      }
      setRows((prev) =>
        prev ? prev.map((r) => (r.reference === row.reference ? { ...r, status: "cancelled" } : r)) : prev
      );
      toast("Votre rendez-vous a bien été annulé. À bientôt au salon !", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Annulation impossible.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto bg-espresso/70 p-4 py-10 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-ivory shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Retrouver ma demande"
          >
            <div className="flex items-start justify-between gap-4 border-b border-espresso/8 p-6">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">
                  Mes <span className="italic text-bronze">rendez-vous</span>
                </h2>
                <p className="mt-1 text-xs text-espresso/55">
                  Retrouvez vos demandes et annulez-les en libre-service.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-espresso/15 text-espresso/60 transition-colors hover:bg-espresso hover:text-ivory"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5 flex w-fit rounded-full border border-espresso/12 bg-white p-1">
                {(["reference", "phone"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setRows(null);
                      setError("");
                      setValue("");
                    }}
                    className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                      mode === m ? "bg-espresso text-ivory" : "text-espresso/55 hover:text-espresso"
                    }`}
                  >
                    {m === "reference" ? "Référence" : "Téléphone"}
                  </button>
                ))}
              </div>

              <form onSubmit={search} className="flex gap-2">
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === "reference" ? `${SALON.refPrefix}-XXXXX` : "+216 98 000 000"}
                  className="min-w-0 flex-1 rounded-xl border border-espresso/15 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-espresso/35 focus:border-bronze focus:ring-2 focus:ring-bronze/20"
                  aria-label={mode === "reference" ? "Votre référence" : "Votre numéro de téléphone"}
                />
                <button
                  type="submit"
                  disabled={loading || value.trim().length < 4}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-espresso px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors enabled:hover:bg-bronze disabled:opacity-40"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="hidden sm:inline">Chercher</span>
                </button>
              </form>

              {error && (
                <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </p>
              )}

              {rows && rows.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {rows.map((r) => {
                    const st = STATUS[r.status] ?? STATUS.pending;
                    const active = r.status === "pending" || r.status === "confirmed";
                    return (
                      <li key={r.reference} className="rounded-2xl border border-espresso/10 bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-serif text-lg leading-tight tracking-tight">{r.service}</p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-espresso/60">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-bronze" />
                                <span className="capitalize">{formatFrDate(r.date)}</span>
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-bronze" />
                                {r.time}
                              </span>
                            </p>
                          </div>
                          <span className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${st.cls}`}>
                            {st.label}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-espresso/8 pt-3">
                          <p className="font-mono text-xs tracking-widest text-espresso/45">{r.reference}</p>
                          {active && (
                            <button
                              onClick={() => void cancelRow(r)}
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-600 transition-colors hover:text-rose-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Annuler
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {rows && rows.length === 0 && !error && (
                <p className="mt-5 rounded-xl border border-dashed border-espresso/20 bg-white/60 px-4 py-6 text-center text-sm text-espresso/55">
                  Aucune demande trouvée. Vérifiez votre saisie ou appelez-nous au {SALON.phoneDisplay}.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
