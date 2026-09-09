"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, RotateCcw, Sparkles, Star, Wand2 } from "lucide-react";
import { catalog } from "@/lib/services";
import { formatDuration, requestBooking } from "@/lib/booking";
import { EASE, FadeUp, SectionHeader } from "./Reveal";

type Option = { label: string; emoji: string; tags: string[] };

const QUESTIONS: { title: string; sub: string; options: Option[] }[] = [
  {
    title: "Comment sont vos cheveux aujourd'hui ?",
    sub: "Soyons honnêtes, personne ne regarde.",
    options: [
      { label: "Ternes, sans éclat", emoji: "🌾", tags: ["shine", "color"] },
      { label: "Secs et abîmés", emoji: "💔", tags: ["care", "damage", "dry"] },
      { label: "Rebels et frisés", emoji: "🌀", tags: ["smooth", "frizz"] },
      { label: "En pleine forme", emoji: "✨", tags: ["styling", "light"] },
    ],
  },
  {
    title: "Quelle est votre envie du moment ?",
    sub: "Celui que vous repoussez depuis des semaines.",
    options: [
      { label: "Illuminer ma couleur", emoji: "🌟", tags: ["light", "color"] },
      { label: "Changer de tête", emoji: "✂️", tags: ["cut"] },
      { label: "Prendre soin de moi", emoji: "🤍", tags: ["care", "skin", "glow"] },
      { label: "Un look de soirée", emoji: "💄", tags: ["makeup", "updo"] },
    ],
  },
  {
    title: "Avez-vous une occasion à venir ?",
    sub: "On ne juge pas, on prépare.",
    options: [
      { label: "Mon mariage 💍", emoji: "👰", tags: ["bridal", "event"] },
      { label: "Une fête, un mariage", emoji: "🎉", tags: ["event", "makeup", "updo"] },
      { label: "Aucune, juste pour moi", emoji: "🌿", tags: ["care", "styling"] },
    ],
  },
  {
    title: "Combien de temps pouvez-vous nous consacrer ?",
    sub: "On s'adapte, promis.",
    options: [
      { label: "Moins d'une heure", emoji: "⚡", tags: ["express"] },
      { label: "Une à deux heures", emoji: "🕐", tags: [] },
      { label: "Toute une après-midi", emoji: "🛋️", tags: [] },
    ],
  },
];

export default function Diagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const done = step >= QUESTIONS.length;

  const results = useMemo(() => {
    const tags = new Set<string>();
    let express = false;
    answers.forEach((choice, qi) => {
      if (choice === undefined) return;
      QUESTIONS[qi]?.options[choice]?.tags.forEach((t) => tags.add(t));
      if (qi === 3 && choice === 0) express = true;
    });
    return catalog
      .map((s) => {
        let score = s.tags.filter((t) => tags.has(t)).length;
        if (express && s.minutes <= 45) score += 1.5;
        if (tags.has("bridal") && s.category === "mariee") score += 2;
        return { service: s, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [answers]);

  const progress = Math.round((Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100);

  function choose(index: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = index;
      return next;
    });
    setStep((s) => s + 1);
  }

  return (
    <section id="diagnostic" className="relative scroll-mt-24 overflow-hidden bg-cream py-24 md:py-32">
      <div aria-hidden className="absolute left-[-12%] top-1/4 h-[24rem] w-[24rem] rounded-full bg-bronze/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 md:px-10">
        <SectionHeader
          align="center"
          eyebrow="Diagnostic beauté"
          title={
            <>
              Ne savez plus quoi choisir ?{" "}
              <span className="italic text-bronze">On vous guide</span>
            </>
          }
          description="Quatre questions, trente secondes, et nous vous proposons les soins faits pour vous — comme lors d'une vraie consultation au salon."
        />

        <FadeUp delay={0.15} className="mt-12">
          <div className="overflow-hidden rounded-[2rem] border border-espresso/8 bg-white shadow-[0_40px_90px_-55px_rgba(60,45,33,0.55)]">
            {/* progress */}
            <div className="h-1 bg-espresso/8">
              <motion.div
                className="h-full bg-gradient-to-r from-bronze to-bronze-light"
                animate={{ width: `${done ? 100 : progress}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>

            <div className="p-7 md:p-12">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key={`q${step}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-bronze">
                      <Wand2 className="h-3.5 w-3.5" />
                      Question {step + 1} / {QUESTIONS.length}
                    </p>
                    <h3 className="mt-4 font-serif text-[clamp(1.5rem,3.6vw,2.4rem)] leading-tight tracking-tight">
                      {QUESTIONS[step].title}
                    </h3>
                    <p className="mt-2 text-sm italic text-espresso/50">{QUESTIONS[step].sub}</p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {QUESTIONS[step].options.map((o, i) => (
                        <motion.button
                          key={o.label}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                          onClick={() => choose(i)}
                          className="group flex items-center gap-4 rounded-2xl border border-espresso/12 bg-ivory p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-bronze hover:bg-cream/60"
                        >
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-xl transition-colors group-hover:bg-white">
                            {o.emoji}
                          </span>
                          <span className="flex-1 text-sm font-semibold text-espresso">{o.label}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-espresso/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-bronze" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <p className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-bronze">
                      <Sparkles className="h-3.5 w-3.5" />
                      Vos recommandations personnalisées
                    </p>
                    <h3 className="mt-4 text-center font-serif text-[clamp(1.5rem,3.6vw,2.4rem)] leading-tight tracking-tight">
                      Voici ce que nous vous{" "}
                      <span className="italic text-bronze">conseillons</span>
                    </h3>

                    <div className="mt-8 space-y-3">
                      {results.map((r, i) => (
                        <motion.div
                          key={r.service.id}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
                          className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ${
                            i === 0
                              ? "border-bronze bg-bronze/8 shadow-[0_16px_35px_-24px_rgba(169,124,80,0.8)]"
                              : "border-espresso/10 bg-ivory hover:border-bronze/50"
                          }`}
                        >
                          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                            <Image src={r.service.image} alt="" fill sizes="64px" className="object-cover" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2">
                              {i === 0 && (
                                <span className="rounded-full bg-espresso px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-ivory">
                                  Top choix
                                </span>
                              )}
                              {Array.from({ length: 3 - i }).map((_, s) => (
                                <Star key={s} className="h-3 w-3 fill-bronze text-bronze" />
                              ))}
                            </p>
                            <p className="mt-1 font-serif text-lg leading-tight tracking-tight">{r.service.name}</p>
                            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[11px] text-espresso/50">
                              <span className="font-bold text-bronze">{r.service.price}</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(r.service.minutes)}
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={() => requestBooking(r.service.id)}
                            className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
                          >
                            Réserver
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                      <button
                        onClick={() => {
                          setAnswers([]);
                          setStep(0);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-espresso/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-espresso/60 transition-colors hover:border-bronze hover:text-bronze"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Refaire le diagnostic
                      </button>
                      <button
                        onClick={() => requestBooking()}
                        className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-bronze"
                      >
                        Voir toutes les prestations
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!done && step > 0 && (
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/40 transition-colors hover:text-bronze"
                >
                  ← Question précédente
                </button>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
