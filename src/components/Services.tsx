"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { coiffureServices, esthetiqueServices } from "@/lib/services";
import { formatDuration, requestBooking } from "@/lib/booking";
import { EASE, FadeUp, SectionHeader } from "./Reveal";

type Tab = "coiffure" | "esthetique";

const tabs: { id: Tab; label: string }[] = [
  { id: "coiffure", label: "Coiffure" },
  { id: "esthetique", label: "Esthétique" },
];

export default function Services() {
  const [tab, setTab] = useState<Tab>("coiffure");
  const [active, setActive] = useState<number | null>(null);

  const items = tab === "coiffure" ? coiffureServices : esthetiqueServices;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const py = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });

  return (
    <section
      id="prestations"
      className="relative scroll-mt-24 bg-cream py-24 md:py-32"
      onMouseMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Nos Prestations"
            title={
              <>
                Des soins d&apos;exception,{" "}
                <span className="italic text-bronze">des tarifs en douceur</span>
              </>
            }
            description="Chaque prestation commence par un diagnostic offert. Touchez une ligne pour réserver directement — les durées sont indicatives."
          />

          <FadeUp delay={0.2}>
            <div className="flex w-fit rounded-full border border-espresso/15 bg-ivory p-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setActive(null);
                  }}
                  className={`relative rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    tab === t.id ? "text-ivory" : "text-espresso/60 hover:text-espresso"
                  }`}
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="tabPill"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-espresso"
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15} className="mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: EASE }}
              onMouseLeave={() => setActive(null)}
            >
              {items.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => requestBooking(s.id)}
                  onMouseEnter={() => setActive(i)}
                  className="group relative flex w-full items-baseline gap-4 border-b border-espresso/12 py-6 text-left transition-colors duration-300 first:border-t hover:border-espresso/25 sm:gap-5"
                >
                  <span className="font-serif text-sm italic text-bronze/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <span className="font-serif text-2xl tracking-tight text-espresso transition-all duration-400 group-hover:translate-x-2 group-hover:italic group-hover:text-bronze md:text-3xl">
                      {s.name}
                    </span>
                    <span className="text-sm text-espresso/55 sm:max-w-xs sm:text-left">
                      {s.desc}
                    </span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-4 self-center lg:flex">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-espresso/40">
                      <Clock className="h-3 w-3" />
                      {formatDuration(s.minutes)}
                    </span>
                    <span className="font-serif text-xl italic text-espresso/80 md:text-2xl">
                      {s.price}
                    </span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center self-center rounded-full border border-espresso/15 text-espresso/50 transition-all duration-300 group-hover:border-bronze group-hover:bg-bronze group-hover:text-ivory">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="mt-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-espresso/40">
            Sur devis pour cheveux très longs ou très épais — Tarifs en dinars tunisiens (TND)
          </p>
        </FadeUp>
      </div>

      {/* floating image preview (desktop) */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key={`${tab}-${active}`}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
            style={{ x: px, y: py }}
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="relative h-64 w-52 -translate-x-1/2 -translate-y-[112%] overflow-hidden rounded-b-3xl rounded-t-[10rem] border-4 border-ivory shadow-2xl">
              <Image
                src={items[active].image}
                alt={items[active].name}
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
