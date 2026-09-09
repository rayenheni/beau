"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarPlus, Check, Loader2 } from "lucide-react";
import { EASE } from "./Reveal";

type Notif = {
  id: string;
  title: string;
  body: string;
  read: number;
  createdAt: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const seen = useRef(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const list: Notif[] = data.notifications ?? [];

      setItems(list);
      setUnread(data.unread ?? 0);

      // Notification navigateur pour toute demande arrivée depuis le dernier cycle.
      const total = list.length;
      if (seen.current > 0 && total > seen.current && "Notification" in window) {
        if (window.Notification.permission === "granted") {
          const latest = list[0];
          new window.Notification(latest.title, { body: latest.body });
        }
      }
      seen.current = total;
    } catch {
      /* silence : le tableau reste utilisable */
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 20000);
    return () => window.clearInterval(id);
  }, [load]);

  async function markAll() {
    setLoading(true);
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      await load();
    } finally {
      setLoading(false);
    }
  }

  function enableBrowserAlerts() {
    if (!("Notification" in window)) return;
    void window.Notification.requestPermission();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications (${unread} non lues)`}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-espresso/15 text-espresso/70 transition-colors hover:border-bronze hover:text-bronze"
      >
        <Bell className="h-4.5 w-4.5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-espresso/10 bg-white shadow-[0_24px_60px_-25px_rgba(33,23,16,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-espresso/8 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/50">
                Alertes du salon
              </p>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button
                    onClick={() => void markAll()}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-bronze hover:underline"
                  >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    Tout lire
                  </button>
                )}
              </div>
            </div>

            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-espresso/50">
                Aucune alerte pour le moment.
              </p>
            ) : (
              <ul className="max-h-80 divide-y divide-espresso/6 overflow-y-auto">
                {items.map((n) => (
                  <li
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 ${n.read === 0 ? "bg-cream/50" : ""}`}
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-espresso text-ivory">
                      <CalendarPlus className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-espresso">{n.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-espresso/60">{n.body}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-espresso/35">
                        {new Date(n.createdAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {n.read === 0 && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-bronze" />}
                  </li>
                ))}
              </ul>
            )}

            {"Notification" in window && window.Notification.permission !== "granted" && (
              <button
                onClick={enableBrowserAlerts}
                className="w-full border-t border-espresso/8 bg-cream/60 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-espresso/60 transition-colors hover:bg-cream"
              >
                Activer les alertes sur cet ordinateur
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
