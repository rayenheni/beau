"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

export const TOAST_EVENT = "salwa:toast";

export type ToastKind = "success" | "error" | "info";

type ToastItem = { id: number; kind: ToastKind; message: string };

export function toast(message: string, kind: ToastKind = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, kind } }));
}

const styles: Record<ToastKind, { icon: typeof Info; ring: string; bar: string }> = {
  success: { icon: CheckCircle2, ring: "border-emerald-200", bar: "bg-emerald-500" },
  error: { icon: TriangleAlert, ring: "border-rose-200", bar: "bg-rose-500" },
  info: { icon: Info, ring: "border-bronze/40", bar: "bg-bronze" },
};

export default function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message: string; kind: ToastKind }>).detail;
      if (!detail?.message) return;
      const id = ++counter;
      setItems((prev) => [...prev.slice(-2), { id, kind: detail.kind ?? "info", message: detail.message }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 5200);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[130] flex flex-col items-center gap-3 px-4">
      <AnimatePresence>
        {items.map((t) => {
          const s = styles[t.kind] ?? styles.info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex w-full max-w-md items-start gap-3 overflow-hidden rounded-2xl border border-espresso/10 bg-white/95 px-5 py-4 shadow-[0_24px_50px_-25px_rgba(33,23,16,0.45)] backdrop-blur"
              role="status"
            >
              <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border ${s.ring} text-espresso`}>
                <s.icon className="h-4 w-4" />
              </span>
              <p className="flex-1 text-sm font-medium leading-relaxed text-espresso">{t.message}</p>
              <button
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
                aria-label="Fermer la notification"
                className="mt-0.5 text-espresso/35 transition-colors hover:text-espresso"
              >
                <X className="h-4 w-4" />
              </button>
              <span className={`absolute bottom-0 left-0 h-0.5 ${s.bar}`} aria-hidden />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
