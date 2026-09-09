"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Loader2, Lock } from "lucide-react";
import { EASE } from "@/components/Reveal";
import { SALON } from "@/lib/salon";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Connexion impossible.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-espresso px-6 py-16 text-ivory">
      <div aria-hidden className="absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-bronze/15 blur-3xl" />
      <div aria-hidden className="absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-rose/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative w-full max-w-md"
      >
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-bronze/50 text-bronze-light">
            <Lock className="h-6 w-6" />
          </span>
          <p className="mt-6 font-serif text-4xl font-medium italic tracking-tight">{SALON.shortName}</p>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.42em] text-bronze-light">
            Espace pro · Accès réservé
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 rounded-[2rem] border border-ivory/10 bg-ivory/5 p-8 backdrop-blur-sm"
        >
          <label
            htmlFor="password"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-ivory/55"
          >
            Mot de passe du salon
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bronze-light" />
            <input
              id="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full rounded-xl border border-ivory/15 bg-espresso/60 py-3.5 pl-11 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory/25 focus:border-bronze-light focus:ring-2 focus:ring-bronze/30"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-bronze px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory transition-all duration-300 enabled:hover:bg-bronze-light disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Vérification…
              </>
            ) : (
              <>
                Accéder à l&apos;espace pro
                <ArrowRightIcon />
              </>
            )}
          </button>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-ivory/40">
            Cet espace est réservé à l&apos;équipe du salon. La gestion des rendez-vous
            nécessite un mot de passe fourni par l&apos;équipe du salon.
          </p>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-ivory/45 transition-colors hover:text-bronze-light"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au site
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
