"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollUI() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-gradient-to-r from-bronze via-bronze-light to-bronze"
      />

      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Revenir en haut de page"
        initial={false}
        animate={{
          opacity: showTop ? 1 : 0,
          y: showTop ? 0 : 18,
          pointerEvents: showTop ? "auto" : "none",
        }}
        transition={{ duration: 0.35 }}
        className="fixed bottom-24 right-5 z-[95] grid h-12 w-12 place-items-center rounded-full border border-espresso/12 bg-ivory/90 text-espresso shadow-[0_16px_35px_-18px_rgba(33,23,16,0.6)] backdrop-blur transition-colors hover:bg-espresso hover:text-ivory sm:bottom-8 sm:right-8"
      >
        <ArrowUp className="h-4.5 w-4.5" />
      </motion.button>
    </>
  );
}
