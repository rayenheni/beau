"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Hourglass,
  Loader2,
  MessageCircle,
  PartyPopper,
  Phone,
  Sparkles,
  Wallet,
} from "lucide-react";
import { catalog, categories, findService, type CategoryId } from "@/lib/services";
import {
  BOOKING_EVENT,
  SALON,
  downloadIcs,
  formatDuration,
  formatFrDate,
  requestBooking,
  whatsappLink,
} from "@/lib/booking";
import { EASE, FadeUp, SectionHeader } from "./Reveal";
import MyBookingModal from "./MyBooking";

type SlotStatus = "free" | "last" | "full" | "past" | "closed";
type SlotState = { time: string; status: SlotStatus; used: number; max: number };

const STEP_LABELS = ["Prestation", "Date & heure", "Vos coordonnées"];

const inputCls =
  "w-full rounded-xl border border-espresso/15 bg-ivory px-4 py-3 text-sm text-espresso outline-none transition placeholder:text-espresso/35 focus:border-bronze focus:ring-2 focus:ring-bronze/20";
const labelCls = "mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-taupe";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

const SLOT_STYLE: Record<SlotStatus, string> = {
  free: "border border-espresso/12 text-espresso/75 hover:border-bronze hover:text-bronze",
  last: "border border-bronze/60 bg-bronze/10 text-bronze hover:bg-bronze hover:text-ivory",
  full: "cursor-not-allowed text-espresso/20 line-through",
  past: "cursor-not-allowed text-espresso/20 line-through",
  closed: "cursor-not-allowed text-espresso/15",
};

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Calendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const todayKey = useMemo(
    () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" }),
    []
  );
  const todayDate = new Date(`${todayKey}T00:00:00`);
  const maxDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 6, 1);

  const [view, setView] = useState(() =>
    value ? new Date(`${value}T00:00:00`) : new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  );

  const y = view.getFullYear();
  const m = view.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: days }, (_, i) => toKey(new Date(y, m, i + 1))),
  ];

  const canPrev = view > new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  const canNext = new Date(y, m + 1, 1) <= maxDate;

  return (
    <div className="rounded-2xl border border-espresso/10 bg-ivory p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canPrev && setView(new Date(y, m - 1, 1))}
          disabled={!canPrev}
          aria-label="Mois précédent"
          className="grid h-8 w-8 place-items-center rounded-full border border-espresso/12 text-espresso/60 transition-colors enabled:hover:border-bronze enabled:hover:text-bronze disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-lg capitalize tracking-tight">
          {MONTHS[m]} {y}
        </p>
        <button
          type="button"
          onClick={() => canNext && setView(new Date(y, m + 1, 1))}
          disabled={!canNext}
          aria-label="Mois suivant"
          className="grid h-8 w-8 place-items-center rounded-full border border-espresso/12 text-espresso/60 transition-colors enabled:hover:border-bronze enabled:hover:text-bronze disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <span
            key={i}
            className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-espresso/35"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((key, i) => {
          if (!key) return <span key={`e${i}`} />;
          const disabled = key < todayKey;
          const selected = key === value;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onChange(key)}
              className={`relative aspect-square rounded-xl text-sm font-medium transition-all duration-200 ${
                selected
                  ? "bg-espresso text-ivory shadow-md"
                  : disabled
                    ? "text-espresso/20"
                    : "text-espresso/80 hover:bg-cream hover:text-espresso"
              }`}
            >
              {Number(key.slice(-2))}
              {isToday && !selected && (
                <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-bronze" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<CategoryId>("coiffure");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [daySlots, setDaySlots] = useState<SlotState[]>([]);
  const [meta, setMeta] = useState({ closed: false, openLabel: "", max: 2 });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const service = findService(serviceId);
  const todayKey = useMemo(
    () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" }),
    []
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ serviceId: string | null }>).detail;
      if (detail?.serviceId) {
        const svc = findService(detail.serviceId);
        if (svc) {
          setServiceId(svc.id);
          setCategory(svc.category);
          setStep(0);
        }
      }
      window.setTimeout(
        () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        120
      );
    };
    window.addEventListener(BOOKING_EVENT, handler);
    return () => window.removeEventListener(BOOKING_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!date) {
      setDaySlots([]);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    const q = new URLSearchParams({ date, minutes: String(service?.minutes ?? 60) });
    fetch(`/api/availability?${q.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setDaySlots(Array.isArray(d.slots) ? d.slots : []);
        setMeta({
          closed: Boolean(d.closed),
          openLabel: d.openLabel ?? "",
          max: d.maxParallel ?? 2,
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, service?.minutes]);

  // Si la prestation change, on revient au choix de l'horaire pour revalider.
  useEffect(() => {
    if (step === 1 && time) setTime("");
  }, [service?.minutes]); // eslint-disable-line react-hooks/exhaustive-deps

  const canContinue = step === 0 ? Boolean(serviceId) : step === 1 ? Boolean(date && time) : true;

  const submit = useCallback(async () => {
    if (!service) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service: service.name,
          serviceId: service.id,
          date,
          time,
          notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Une erreur est survenue.");
      setReference(data.reference ?? "");
      setStatus("done");
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setStatus("idle");
    }
  }, [service, name, phone, date, time, notes]);

  const waText = reference
    ? `Bonjour ${SALON.name} 👋\nJe viens de réserver en ligne (réf. ${reference}).\n• Prestation : ${service?.name}\n• Date : ${formatFrDate(date)} à ${time}\nPouvez-vous me confirmer ? Merci beaucoup !`
    : "";

  function reset() {
    setStep(0);
    setServiceId(null);
    setDate("");
    setTime("");
    setNotes("");
    setReference("");
    setStatus("idle");
    setError("");
  }

  return (
    <section id="reservation" className="relative scroll-mt-24 overflow-hidden bg-ivory py-24 md:py-32">
      <div aria-hidden className="absolute right-[-10%] top-[-8%] h-[26rem] w-[26rem] rounded-full bg-bronze/10 blur-3xl" />
      <MyBookingModal open={lookupOpen} onClose={() => setLookupOpen(false)} />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div ref={topRef} className="scroll-mt-32" />

        <SectionHeader
          align="center"
          eyebrow="Réservation en ligne"
          title={
            <>
              Votre moment beauté,{" "}
              <span className="italic text-bronze">en trois gestes</span>
            </>
          }
          description="Choisissez votre soin et votre créneau — les disponibilités réelles du salon, durée de la prestation comprise, s'affichent en direct — puis laissez-nous vos coordonnées."
        />

        <FadeUp delay={0.15} className="mt-6 flex justify-center">
          <button
            onClick={() => setLookupOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-espresso/15 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/60 transition-colors hover:border-bronze hover:text-bronze"
          >
            <Hourglass className="h-3.5 w-3.5" />
            Retrouver ou annuler ma demande
          </button>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* ---------- Assistant ---------- */}
            <div className="overflow-hidden rounded-[2rem] border border-espresso/8 bg-white shadow-[0_40px_90px_-50px_rgba(60,45,33,0.55)] lg:col-span-2">
              <div className="border-b border-espresso/8 bg-cream/40 px-6 py-5 md:px-9">
                <div className="flex items-center gap-2 md:gap-4">
                  {STEP_LABELS.map((label, i) => {
                    const done = step > i;
                    const active = step === i;
                    return (
                      <div key={label} className="flex flex-1 items-center gap-2 md:gap-3">
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-all duration-400 ${
                            done
                              ? "bg-bronze text-ivory"
                              : active
                                ? "bg-espresso text-ivory"
                                : "border border-espresso/15 text-espresso/40"
                          }`}
                        >
                          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                        </span>
                        <span
                          className={`hidden text-[10px] font-bold uppercase tracking-[0.16em] sm:block ${
                            active ? "text-espresso" : "text-espresso/40"
                          }`}
                        >
                          {label}
                        </span>
                        {i < STEP_LABELS.length - 1 && (
                          <span className="relative h-px flex-1 overflow-hidden bg-espresso/12">
                            <span
                              className={`absolute inset-0 bg-bronze transition-all duration-700 ${
                                step > i ? "w-full" : "w-0"
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 md:p-9">
                <AnimatePresence mode="wait">
                  {/* Étape 1 : prestation */}
                  {step === 0 && (
                    <motion.div
                      key="s0"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <div className="mb-6 flex flex-wrap gap-2">
                        {categories.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setCategory(c.id)}
                            className={`rounded-full px-5 py-2.5 text-left transition-all duration-300 ${
                              category === c.id
                                ? "bg-espresso text-ivory"
                                : "border border-espresso/12 text-espresso/65 hover:border-bronze hover:text-bronze"
                            }`}
                          >
                            <span className="block text-[11px] font-bold uppercase tracking-[0.16em]">
                              {c.label}
                            </span>
                            <span
                              className={`block text-[10px] ${
                                category === c.id ? "text-ivory/60" : "text-espresso/40"
                              }`}
                            >
                              {c.sub}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {catalog
                          .filter((s) => s.category === category)
                          .map((s, i) => {
                            const selected = serviceId === s.id;
                            return (
                              <motion.button
                                key={s.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                                onClick={() => {
                                  setServiceId(s.id);
                                  setStep(1);
                                }}
                                className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                                  selected
                                    ? "border-bronze bg-bronze/8 shadow-[0_14px_30px_-20px_rgba(169,124,80,0.7)]"
                                    : "border-espresso/10 hover:border-bronze/60 hover:bg-cream/50"
                                }`}
                              >
                                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                                  <Image src={s.image} alt="" fill sizes="64px" className="object-cover" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate font-serif text-lg leading-tight tracking-tight text-espresso">
                                    {s.name}
                                  </span>
                                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-espresso/50">
                                    <span className="font-bold text-bronze">{s.price}</span>
                                    <span className="inline-flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDuration(s.minutes)}
                                    </span>
                                  </span>
                                </span>
                                <span
                                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                                    selected
                                      ? "bg-bronze text-ivory"
                                      : "border border-espresso/15 text-espresso/35 group-hover:border-bronze group-hover:text-bronze"
                                  }`}
                                >
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                              </motion.button>
                            );
                          })}
                      </div>
                      <p className="mt-5 text-center text-xs text-espresso/45">
                        Un doute ? Essayez notre{" "}
                        <a href="#diagnostic" className="font-bold text-bronze underline underline-offset-4">
                          diagnostic beauté personnalisé
                        </a>
                        .
                      </p>
                    </motion.div>
                  )}

                  {/* Étape 2 : date & heure */}
                  {step === 1 && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="grid gap-6 md:grid-cols-2"
                    >
                      <div>
                        <p className={labelCls}>Choisissez votre date</p>
                        <Calendar value={date} onChange={setDate} />
                        {service && (
                          <p className="mt-3 flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-[11px] text-espresso/60">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-bronze" />
                            {service.name} : {formatDuration(service.minutes)} — les créneaux
                            tiennent compte de cette durée.
                          </p>
                        )}
                      </div>

                      <div>
                        <p className={labelCls}>Créneaux disponibles</p>
                        <div className="rounded-2xl border border-espresso/10 bg-ivory p-4">
                          {!date ? (
                            <div className="grid h-full min-h-[13rem] place-items-center text-center">
                              <div>
                                <CalendarDays className="mx-auto h-7 w-7 text-bronze/50" />
                                <p className="mt-3 text-sm text-espresso/50">
                                  Sélectionnez d&apos;abord une date
                                  <br />
                                  pour voir les horaires libres
                                </p>
                              </div>
                            </div>
                          ) : loadingSlots ? (
                            <div className="grid h-full min-h-[13rem] place-items-center">
                              <Loader2 className="h-6 w-6 animate-spin text-bronze" />
                            </div>
                          ) : meta.closed ? (
                            <div className="grid h-full min-h-[13rem] place-items-center px-4 text-center">
                              <div>
                                <p className="font-serif text-xl italic text-espresso/70">
                                  Le salon est fermé ce jour-là
                                </p>
                                <p className="mt-2 text-sm text-espresso/50">
                                  Merci de choisir une autre date.
                                </p>
                              </div>
                            </div>
                          ) : daySlots.length === 0 ? (
                            <div className="grid h-full min-h-[13rem] place-items-center px-4 text-center">
                              <p className="text-sm text-espresso/50">
                                Aucun créneau pour cette prestation ce jour-là — elle est trop
                                longue pour les horaires restants.
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                                {daySlots.map((slot) => {
                                  const disabled = slot.status === "full" || slot.status === "past" || slot.status === "closed";
                                  const selected = time === slot.time;
                                  return (
                                    <button
                                      key={slot.time}
                                      type="button"
                                      disabled={disabled}
                                      onClick={() => setTime(slot.time)}
                                      title={
                                        slot.status === "last"
                                          ? "Dernière place disponible"
                                          : slot.status === "full"
                                            ? "Créneau complet"
                                            : undefined
                                      }
                                      className={`rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
                                        selected
                                          ? "bg-espresso text-ivory shadow-md"
                                          : SLOT_STYLE[slot.status]
                                      }`}
                                    >
                                      {slot.time}
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-espresso/8 pt-3 text-[10px] text-espresso/45">
                                <span className="inline-flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-espresso" /> Sélectionné
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full border border-bronze bg-bronze/20" />{" "}
                                  Dernière place
                                </span>
                                <span className="ml-auto">{formatFrDate(date)}</span>
                              </div>
                              {meta.openLabel && (
                                <p className="mt-2 text-center text-[10px] uppercase tracking-[0.16em] text-espresso/35">
                                  Salon ouvert {meta.openLabel} · {meta.max} poste
                                  {meta.max > 1 ? "s" : ""}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Étape 3 : coordonnées */}
                  {step === 2 && (
                    <motion.form
                      key="s2"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        void submit();
                      }}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <div>
                        <label htmlFor="bk-name" className={labelCls}>
                          Nom complet
                        </label>
                        <input
                          id="bk-name"
                          required
                          minLength={2}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex. Rania Gharbi"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="bk-phone" className={labelCls}>
                          Téléphone / WhatsApp
                        </label>
                        <input
                          id="bk-phone"
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ex. +216 98 000 000"
                          className={inputCls}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="bk-notes" className={labelCls}>
                          Précisions{" "}
                          <span className="font-medium normal-case tracking-normal text-espresso/35">
                            (optionnel)
                          </span>
                        </label>
                        <textarea
                          id="bk-notes"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Longueur des cheveux, référence couleur, occasion particulière…"
                          className={`${inputCls} resize-none`}
                        />
                      </div>

                      {error && (
                        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group flex w-full items-center justify-center gap-3 rounded-full bg-espresso px-7 py-4 text-xs font-bold uppercase tracking-[0.22em] text-ivory transition-all duration-300 hover:bg-bronze disabled:opacity-60 sm:col-span-2"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…
                          </>
                        ) : (
                          <>
                            Confirmer ma demande
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </>
                        )}
                      </button>
                      <p className="text-center text-xs text-espresso/40 sm:col-span-2">
                        Aucun paiement en ligne — annulation gratuite à tout moment.
                      </p>
                    </motion.form>
                  )}

                  {/* Étape 4 : confirmation */}
                  {step === 3 && (
                    <motion.div
                      key="s3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="flex flex-col items-center text-center"
                    >
                      <motion.span
                        initial={{ scale: 0.4, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 14 }}
                        className="grid h-16 w-16 place-items-center rounded-full bg-bronze/15 text-bronze"
                      >
                        <PartyPopper className="h-7 w-7" />
                      </motion.span>
                      <h3 className="mt-5 font-serif text-3xl tracking-tight">
                        Merci <span className="italic text-bronze">{name.split(" ")[0]}</span> !
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-espresso/65">
                        Votre demande est bien enregistrée. Nous vous rappelons au{" "}
                        <strong className="text-espresso">{phone}</strong> pour la confirmer.
                      </p>

                      <div className="mt-7 w-full max-w-md rounded-2xl border border-dashed border-bronze/50 bg-cream/50 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-espresso/45">
                          Votre référence
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-3">
                          <p className="font-serif text-3xl tracking-[0.12em] text-espresso">
                            {reference}
                          </p>
                          <button
                            onClick={() => {
                              void navigator.clipboard?.writeText(reference).then(() => {
                                setCopied(true);
                                window.setTimeout(() => setCopied(false), 2000);
                              });
                            }}
                            aria-label="Copier la référence"
                            className="grid h-8 w-8 place-items-center rounded-full border border-espresso/15 text-espresso/50 transition-colors hover:border-bronze hover:text-bronze"
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                        <a
                          href={whatsappLink(waText)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f8a4c] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Confirmer sur WhatsApp
                        </a>
                        <button
                          onClick={() =>
                            service &&
                            downloadIcs({
                              reference,
                              service: service.name,
                              date,
                              time,
                              minutes: service.minutes,
                            })
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-espresso/20 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-espresso transition-colors hover:border-bronze hover:text-bronze"
                        >
                          <CalendarDays className="h-4 w-4" />
                          Ajouter à mon agenda
                        </button>
                      </div>

                      <button
                        onClick={reset}
                        className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso/45 underline underline-offset-4 transition-colors hover:text-bronze"
                      >
                        Prendre un autre rendez-vous
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {step < 3 && (
                  <div className="mt-8 flex items-center justify-between border-t border-espresso/8 pt-6">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso/50 transition-colors enabled:hover:text-bronze disabled:opacity-0"
                    >
                      <ArrowLeft className="h-4 w-4" /> Retour
                    </button>
                    {step < 2 && (
                      <button
                        onClick={() => setStep((s) => s + 1)}
                        disabled={!canContinue}
                        className="group inline-flex items-center gap-2.5 rounded-full bg-espresso px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory transition-all duration-300 enabled:hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        {step === 0 ? "Choisir le créneau" : "Finaliser"}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ---------- Récapitulatif ---------- */}
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-espresso/8 bg-espresso p-7 text-ivory shadow-[0_40px_80px_-50px_rgba(33,23,16,0.8)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze-light">
                  Votre sélection
                </p>

                {service ? (
                  <div className="mt-5 flex items-start gap-4">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image src={service.image} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-xl leading-tight tracking-tight">{service.name}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-ivory/55">{service.desc}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 font-serif text-xl italic text-ivory/45">
                    Aucune prestation choisie pour l&apos;instant…
                  </p>
                )}

                <dl className="mt-6 space-y-3 border-t border-ivory/10 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-ivory/55">
                      <CalendarDays className="h-3.5 w-3.5 text-bronze-light" /> Date
                    </dt>
                    <dd className="font-medium capitalize">{date ? formatFrDate(date) : "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 text-ivory/55">
                      <Clock className="h-3.5 w-3.5 text-bronze-light" /> Heure
                    </dt>
                    <dd className="font-medium">{time || "—"}</dd>
                  </div>
                  {service && (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="inline-flex items-center gap-2 text-ivory/55">
                          <Hourglass className="h-3.5 w-3.5 text-bronze-light" /> Durée
                        </dt>
                        <dd className="font-medium">{formatDuration(service.minutes)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 border-t border-ivory/10 pt-3">
                        <dt className="inline-flex items-center gap-2 text-ivory/55">
                          <Wallet className="h-3.5 w-3.5 text-bronze-light" /> À partir de
                        </dt>
                        <dd className="font-serif text-xl italic text-bronze-light">{service.price}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>

              <div className="rounded-[2rem] border border-espresso/8 bg-cream/60 p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-espresso/45">
                  Besoin d&apos;aide ?
                </p>
                <div className="mt-4 space-y-3">
                  <a
                    href={`tel:${SALON.phone}`}
                    className="group flex items-center gap-3 rounded-xl bg-ivory px-4 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-white"
                  >
                    <Phone className="h-4 w-4 text-bronze" />
                    {SALON.phoneDisplay}
                  </a>
                  <a
                    href={whatsappLink(`Bonjour ${SALON.shortName} 👋 j'ai besoin d'aide pour réserver.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-xl bg-ivory px-4 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-white"
                  >
                    <MessageCircle className="h-4 w-4 text-bronze" />
                    Écrire sur WhatsApp
                  </a>
                  <p className="flex items-center gap-2 pt-1 text-xs text-espresso/50">
                    <Sparkles className="h-3.5 w-3.5 text-bronze" />
                    Horaires réels affichés à l&apos;étape suivante
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
