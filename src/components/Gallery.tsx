"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, MoveHorizontal, X } from "lucide-react";
import { FadeUp, SectionHeader } from "./Reveal";
import { toast } from "./Toast";

const items = [
  { src: "/images/hair-color.jpg", caption: "Balayage caramel", ratio: "aspect-[3/4]" },
  { src: "/images/bride.jpg", caption: "Chignon de mariée", ratio: "aspect-square" },
  { src: "/images/service-coiffure.jpg", caption: "Brushing signature", ratio: "aspect-[4/5]" },
  { src: "/images/makeup.jpg", caption: "Maquillage glamour", ratio: "aspect-[4/5]" },
  { src: "/images/service-esthetique.jpg", caption: "Rituel soin du visage", ratio: "aspect-square" },
  { src: "/images/nails.jpg", caption: "Manucure nude", ratio: "aspect-[3/4]" },
];

/* ---------------- Avant / Après ---------------- */
function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (dragging.current) setFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-[2rem] border border-espresso/10 shadow-[0_40px_80px_-50px_rgba(60,45,33,0.55)]"
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
      data-cursor
    >
      {/* after (base) */}
      <Image
        src="/images/after.jpg"
        alt="Après : cheveux brillants avec balayage"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        draggable={false}
      />
      {/* before (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src="/images/before.jpg"
          alt="Avant : cheveux ternes et secs"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* labels */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-espresso/75 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ivory backdrop-blur">
        Avant
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-bronze px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ivory">
        Après
      </span>

      {/* handle */}
      <div
        className="absolute inset-y-0 w-0.5 bg-ivory shadow-[0_0_20px_rgba(0,0,0,0.35)]"
        style={{ left: `${pos}%` }}
      >
        <button
          aria-label="Comparer avant et après"
          onPointerDown={(e) => {
            e.stopPropagation();
            dragging.current = true;
          }}
          className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-ivory bg-espresso text-ivory shadow-xl transition-transform hover:scale-110"
        >
          <MoveHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* accessible control */}
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Position du comparateur avant / après"
        className="absolute bottom-0 left-0 h-8 w-full cursor-ew-resize opacity-0"
      />

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ivory/85 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-espresso/70 backdrop-blur transition-opacity group-hover:opacity-0">
        Glissez pour comparer
      </p>
    </div>
  );
}

/* ---------------- Galerie ---------------- */
export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(() => setOpen((i) => (i === null ? null : (i + 1) % items.length)), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    []
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  return (
    <section id="galerie" className="scroll-mt-24 bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          eyebrow="Transformations"
          title={
            <>
              Le résultat,{" "}
              <span className="italic text-bronze">sous vos yeux</span>
            </>
          }
          description="Faites glisser le curseur pour découvrir la transformation, puis explorez la galerie en plein écran."
        />

        <FadeUp delay={0.15} className="mt-14">
          <BeforeAfter />
        </FadeUp>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-espresso/40">
          <span>Coloration + soin profond</span>
          <span aria-hidden className="h-1 w-1 rotate-45 bg-bronze" />
          <span>Réalisé au salon</span>
          <span aria-hidden className="h-1 w-1 rotate-45 bg-bronze" />
          <span>2 h 30 de transformation</span>
        </div>

        <div className="mt-16 columns-2 gap-4 md:columns-3 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5">
          {items.map((item, i) => (
            <FadeUp key={item.caption} delay={(i % 3) * 0.08}>
              <button
                onClick={() => setOpen(i)}
                className={`group relative block w-full overflow-hidden rounded-2xl ${item.ratio} shadow-[0_24px_50px_-30px_rgba(60,45,33,0.45)]`}
                aria-label={`Agrandir : ${item.caption}`}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-0 left-0 flex w-full translate-y-3 items-center justify-between p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="font-serif text-lg italic text-ivory">{item.caption}</span>
                  <ArrowUpRight className="h-4 w-4 text-ivory/80" />
                </span>
              </button>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2}>
          <div className="mt-10 text-center">
            <a
              href="https://www.instagram.com/salon.salwa/"
              target="_blank"
              rel="noreferrer"
              onClick={() => toast("Vous allez découvrir notre univers Instagram ✨", "info")}
              className="group inline-flex items-center gap-2 rounded-full border border-espresso/20 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso transition-all duration-300 hover:border-bronze hover:text-bronze"
            >
              @salon.salwa sur Instagram
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </FadeUp>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-espresso/95 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Fermer la galerie"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-ivory/25 text-ivory/80 transition-colors hover:bg-ivory hover:text-espresso"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Image précédente"
              className="absolute left-3 z-10 grid h-12 w-12 place-items-center rounded-full border border-ivory/25 text-ivory/80 transition-colors hover:bg-ivory hover:text-espresso md:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Image suivante"
              className="absolute right-3 z-10 grid h-12 w-12 place-items-center rounded-full border border-ivory/25 text-ivory/80 transition-colors hover:bg-ivory hover:text-espresso md:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.figure
              key={items[open].src}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[80vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/5] max-h-[76vh] w-full overflow-hidden rounded-2xl">
                <Image
                  src={items[open].src}
                  alt={items[open].caption}
                  fill
                  className="object-cover"
                  sizes="90vw"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between text-ivory">
                <span className="font-serif text-xl italic">{items[open].caption}</span>
                <span className="text-xs font-bold tracking-[0.2em] text-ivory/50">
                  {String(open + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
