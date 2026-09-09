"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FadeUp({
  children,
  delay = 0,
  className = "",
  y = 36,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <FadeUp>
        <p
          className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] ${
            dark ? "text-bronze-light" : "text-bronze"
          } ${align === "center" ? "justify-center" : ""}`}
        >
          <span className={`h-px w-10 ${dark ? "bg-bronze-light/70" : "bg-bronze/70"}`} />
          {eyebrow}
        </p>
      </FadeUp>
      <FadeUp delay={0.1}>
        <h2
          className={`mt-5 font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.06] tracking-tight ${
            dark ? "text-ivory" : "text-espresso"
          }`}
        >
          {title}
        </h2>
      </FadeUp>
      {description ? (
        <FadeUp delay={0.18}>
          <p
            className={`mt-5 text-base leading-relaxed md:text-lg ${
              dark ? "text-ivory/65" : "text-espresso/65"
            }`}
          >
            {description}
          </p>
        </FadeUp>
      ) : null}
    </div>
  );
}
