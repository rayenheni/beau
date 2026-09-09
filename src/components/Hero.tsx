"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { EASE } from "./Reveal";
import Marquee from "./Marquee";
import { FacebookIcon } from "./BrandIcons";
import { SALON, requestBooking } from "@/lib/booking";

function RevealLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-1 ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);

  return (
    <section id="accueil" ref={ref} className="relative overflow-hidden pt-28 md:pt-36">
      {/* ambient glows */}
      <div
        aria-hidden
        className="absolute -top-48 right-[-12%] h-[36rem] w-[36rem] rounded-full bg-rose/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute left-[-16%] top-1/3 h-[30rem] w-[30rem] rounded-full bg-bronze/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-16 md:grid-cols-12 md:px-10 md:pb-24">
        <motion.div style={{ y: textY }} className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-bronze"
          >
            <span className="h-px w-10 bg-bronze/70" />
            {SALON.tagline} — {SALON.addressShort}
          </motion.p>

          <h1 className="font-serif text-[clamp(2.9rem,6.8vw,6.4rem)] leading-[1.02] tracking-tight">
            <RevealLine delay={0.3}>Il est toujours</RevealLine>
            <RevealLine delay={0.42}>temps de se faire</RevealLine>
            <RevealLine delay={0.54} className="italic text-bronze">
              plus belle.
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
            className="mt-8 max-w-xl text-base leading-relaxed text-espresso/70 md:text-lg"
          >
            Au cœur de {SALON.city}, {SALON.shortName} et son équipe subliment vos cheveux et votre beauté :
            balayages lumineux, lissages kératine, chignons de mariée, maquillage et soins
            du visage — avec passion, depuis plus de dix ans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => requestBooking()}
              className="group inline-flex items-center gap-3 rounded-full bg-espresso px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-ivory transition-all duration-300 hover:bg-bronze"
            >
              Réserver une séance
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href="#prestations"
              className="inline-flex items-center gap-3 rounded-full border border-espresso/20 px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-espresso transition-all duration-300 hover:border-bronze hover:text-bronze"
            >
              Découvrir les soins
            </a>
          </motion.div>

          <motion.a
            href={SALON.facebookReviews}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="group mt-10 inline-flex flex-wrap items-center gap-3"
          >
            <span className="flex text-bronze">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </span>
            <span className="text-sm font-medium text-espresso/60 group-hover:text-espresso">
              82&nbsp;% de clientes nous recommandent sur Facebook
            </span>
            <FacebookIcon className="h-4 w-4 text-espresso/40 transition-colors group-hover:text-bronze" />
          </motion.a>
        </motion.div>

        <div className="relative md:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.45, ease: EASE }}
            className="relative aspect-[3/4] overflow-hidden rounded-b-[2rem] rounded-t-[14rem] shadow-[0_50px_90px_-40px_rgba(60,45,33,0.55)]"
          >
            <motion.div style={{ y: imgY }} className="absolute inset-[-9%]">
              <Image
                src="/images/hero.jpg"
                alt={`Chevelure brillance — ${SALON.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </motion.div>
          </motion.div>

          {/* rotating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
            className="absolute -bottom-7 -left-4 z-10 grid h-28 w-28 place-items-center rounded-full bg-espresso text-ivory shadow-2xl md:-left-12 md:h-36 md:w-36"
            data-cursor
          >
            <svg
              viewBox="0 0 100 100"
              className="animate-spin-slower absolute inset-0 h-full w-full p-2"
              aria-hidden
            >
              <defs>
                <path
                  id="badgeCircle"
                  d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text className="fill-current text-[8px] font-semibold uppercase tracking-[0.2em]">
                <textPath href="#badgeCircle">{SALON.shortName} · {SALON.tagline} · {SALON.city} ·</textPath>
              </text>
            </svg>
            <Sparkles className="h-5 w-5 text-bronze-light md:h-6 md:w-6" />
          </motion.div>
        </div>
      </div>

      {/* vertical side note */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 xl:block"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-espresso/35 [writing-mode:vertical-rl]">
          Rue Houcine Bouzaiene · Théâtre de l&apos;Étoile du Nord
        </p>
      </div>

      <Marquee />
    </section>
  );
}
