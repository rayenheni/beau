"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2, Settings2 } from "lucide-react";
import { EASE } from "./Reveal";
import { toast } from "./Toast";

type Settings = {
  maxParallel: number;
  bufferMinutes: number;
  openMinutes: number;
  closeMinutes: number;
  closedWeekdays: string;
  notifyEmail: string | null;
};

const DAYS = [
  { v: 0, l: "Dim" },
  { v: 1, l: "Lun" },
  { v: 2, l: "Mar" },
  { v: 3, l: "Mer" },
  { v: 4, l: "Jeu" },
  { v: 5, l: "Ven" },
  { v: 6, l: "Sam" },
];

function toTime(mins: number) {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}
function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [s, setS] = useState({
    maxParallel: initial.maxParallel,
    bufferMinutes: initial.bufferMinutes,
    open: toTime(initial.openMinutes),
    close: toTime(initial.closeMinutes),
    closed: initial.closedWeekdays,
    notifyEmail: initial.notifyEmail ?? "",
  });
  const [saving, setSaving] = useState(false);

  const closedList = s.closed
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v >= 0 && v <= 6);

  function toggleDay(v: number) {
    const next = closedList.includes(v)
      ? closedList.filter((d) => d !== v)
      : [...closedList, v].sort();
    setS((p) => ({ ...p, closed: next.join(",") }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxParallel: s.maxParallel,
          bufferMinutes: s.bufferMinutes,
          openMinutes: toMinutes(s.open),
          closeMinutes: toMinutes(s.close),
          closedWeekdays: s.closed,
          notifyEmail: s.notifyEmail,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Enregistrement impossible.");
      toast("Paramètres du salon enregistrés.", "success");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Enregistrement impossible.", "error");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-espresso/15 bg-ivory px-3 py-2.5 text-sm outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20";
  const labelCls = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-espresso/45";

  return (
    <motion.form
      onSubmit={save}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="rounded-3xl border border-espresso/8 bg-white p-6 shadow-[0_24px_60px_-45px_rgba(60,45,33,0.45)]"
    >
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-bronze">
        <Settings2 className="h-4 w-4" />
        Réglages du salon
      </p>
      <p className="mt-2 text-xs leading-relaxed text-espresso/55">
        Ces réglages pilotent directement les créneaux proposés aux clientes. Aucun code à
        modifier.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="maxParallel" className={labelCls}>
            Postes simultanés
          </label>
          <input
            id="maxParallel"
            type="number"
            min={1}
            max={20}
            value={s.maxParallel}
            onChange={(e) => setS((p) => ({ ...p, maxParallel: Number(e.target.value) }))}
            className={inputCls}
          />
          <p className="mt-1 text-[10px] text-espresso/40">
            Fauteuils ou praticiennes en même temps.
          </p>
        </div>

        <div>
          <label htmlFor="buffer" className={labelCls}>
            Marge entre clientes (min)
          </label>
          <input
            id="buffer"
            type="number"
            min={0}
            max={120}
            step={5}
            value={s.bufferMinutes}
            onChange={(e) => setS((p) => ({ ...p, bufferMinutes: Number(e.target.value) }))}
            className={inputCls}
          />
          <p className="mt-1 text-[10px] text-espresso/40">Nettoyage, rangement, accueil.</p>
        </div>

        <div>
          <label htmlFor="open" className={labelCls}>
            Ouverture
          </label>
          <input
            id="open"
            type="time"
            value={s.open}
            onChange={(e) => setS((p) => ({ ...p, open: e.target.value }))}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="close" className={labelCls}>
            Fermeture
          </label>
          <input
            id="close"
            type="time"
            value={s.close}
            onChange={(e) => setS((p) => ({ ...p, close: e.target.value }))}
            className={inputCls}
          />
          <p className="mt-1 text-[10px] text-espresso/40">
            Une prestation ne peut pas dépasser cette heure.
          </p>
        </div>

        <div className="sm:col-span-2">
          <span className={labelCls}>Jours de fermeture hebdomadaire</span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const off = closedList.includes(d.v);
              return (
                <button
                  key={d.v}
                  type="button"
                  onClick={() => toggleDay(d.v)}
                  className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                    off
                      ? "bg-rose-500 text-white"
                      : "border border-espresso/15 text-espresso/60 hover:border-bronze hover:text-bronze"
                  }`}
                >
                  {d.l}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[10px] text-espresso/40">
            En rouge = salon fermé, aucun créneau proposé.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notify" className={labelCls}>
            E-mail d&apos;alerte nouvelle réservation
          </label>
          <input
            id="notify"
            type="email"
            value={s.notifyEmail}
            onChange={(e) => setS((p) => ({ ...p, notifyEmail: e.target.value }))}
            placeholder="salon@exemple.tn — optionnel"
            className={inputCls}
          />
          <p className="mt-1 text-[10px] leading-relaxed text-espresso/40">
            Nécessite les clés d&apos;un fournisseur d&apos;e-mail côté serveur. Les alertes
            internes fonctionnent sans configuration.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-espresso px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory transition-colors enabled:hover:bg-bronze disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…
          </>
        ) : (
          <>
            <Check className="h-4 w-4" /> Enregistrer les réglages
          </>
        )}
      </button>
    </motion.form>
  );
}
