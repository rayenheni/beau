"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin, Menu, Phone, X } from "lucide-react";
import { EASE } from "./Reveal";
import { FacebookIcon, InstagramIcon } from "./BrandIcons";

const links = [
  { label: "Le Salon", href: "#salon" },
  { label: "Prestations", href: "#prestations" },
  { label: "Mariées", href: "#mariees" },
  { label: "Galerie", href: "#galerie" },
  { label: "Avis", href: "#avis" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-500 ${
          scrolled
            ? "border-b border-espresso/10 bg-ivory/85 py-3 backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
          <a href="#accueil" className="group flex flex-col leading-none" aria-label="Salon Salwa — Accueil">
            <span className="font-serif text-3xl font-medium italic tracking-tight transition-colors group-hover:text-bronze">
              Salwa
            </span>
            <span className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.42em] text-bronze">
              Coiffure · Esthétique
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative text-[12px] font-semibold uppercase tracking-[0.18em] text-espresso/75 transition-colors hover:text-espresso"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-bronze transition-all duration-400 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="tel:+21629311109"
              className="hidden items-center gap-2 text-sm font-semibold text-espresso/80 transition-colors hover:text-bronze md:flex"
            >
              <Phone className="h-4 w-4" />
              +216 29 311 109
            </a>
            <a
              href="#reservation"
              className="group hidden items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory transition-all duration-300 hover:bg-bronze sm:flex"
            >
              Réserver
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:bg-espresso hover:text-ivory lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: "-4%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-4%" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-0 z-[100] flex flex-col bg-espresso text-ivory"
          >
            <div className="flex items-center justify-between px-6 py-5 md:px-10">
              <span className="font-serif text-3xl font-medium italic">Salwa</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-ivory/25 transition-colors hover:bg-ivory hover:text-espresso"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-8 md:px-14">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}
                  className="group flex items-baseline gap-4 py-2"
                >
                  <span className="text-xs font-bold text-bronze-light">0{i + 1}</span>
                  <span className="font-serif text-4xl tracking-tight transition-colors group-hover:italic group-hover:text-bronze-light sm:text-5xl">
                    {l.label}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href="#reservation"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.6, ease: EASE }}
                className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-bronze px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-bronze-light"
              >
                Réserver une séance
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </nav>

            <div className="grid gap-4 border-t border-ivory/10 px-8 py-6 text-sm text-ivory/60 md:grid-cols-3 md:px-14">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-bronze-light" />
                Centre-Ville, Tunis
              </span>
              <a href="tel:+21629311109" className="flex items-center gap-2 transition-colors hover:text-ivory">
                <Phone className="h-4 w-4 text-bronze-light" />
                +216 29 311 109
              </a>
              <span className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/p/Salon-Salwa-de-Coiffure-dEsth%C3%A9tique-100063708455598/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="transition-colors hover:text-ivory"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/salon.salwa/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="transition-colors hover:text-ivory"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
