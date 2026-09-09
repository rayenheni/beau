"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./Reveal";

const KEY = "salon:intro-seen";
const DURATION = 1700;

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(KEY)) return;

    let raf = 0;
    let timer = 0;
    const start = performance.now();

    const tick = (t: number) => {
      // Les mises à jour d'état sont volontairement asynchrones (rAF), ce qui
      // évite les rendus en cascade interdits par react-hooks/set-state-in-effect.
      setVisible(true);
      document.body.style.overflow = "hidden";

      const p = Math.min(1, (t - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(eased * 100));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      sessionStorage.setItem(KEY, "1");
      timer = window.setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 420);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-espresso text-ivory"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-bronze-light"
          >
            Coiffure · Esthétique · Tunis
          </motion.p>

          <div className="mt-6 overflow-hidden px-4">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="text-center font-serif text-[clamp(1.8rem,6vw,3.4rem)] leading-tight tracking-tight"
            >
              Il est toujours temps de se faire{" "}
              <span className="italic text-bronze-light">plus belle</span>
            </motion.p>
          </div>

          <div className="mt-10 h-px w-56 overflow-hidden bg-ivory/15">
            <motion.div className="h-full bg-bronze-light" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-4 font-serif text-sm italic tracking-[0.3em] text-ivory/50">
            {progress}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
