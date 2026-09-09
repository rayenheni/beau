import Link from "next/link";
import { ArrowUp, Clock, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./BrandIcons";

const nav = [
  { label: "Le Salon", href: "#salon" },
  { label: "Prestations", href: "#prestations" },
  { label: "Mariées", href: "#mariees" },
  { label: "Galerie", href: "#galerie" },
  { label: "Avis", href: "#avis" },
  { label: "Réserver", href: "#reservation" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-espresso pt-20 text-ivory">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="font-serif text-4xl font-medium italic tracking-tight">Salwa</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.42em] text-bronze-light">
            Coiffure · Esthétique
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">
            « Il est toujours temps de se faire plus belle. » Salon de coiffure et
            d&apos;esthétique au cœur de Tunis, dédié à votre beauté depuis plus de dix ans.
          </p>
          <div className="mt-7 flex gap-3">
            <a
              href="https://www.facebook.com/p/Salon-Salwa-de-Coiffure-dEsth%C3%A9tique-100063708455598/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory/70 transition-all duration-300 hover:border-bronze-light hover:bg-bronze hover:text-ivory"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/salon.salwa/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory/70 transition-all duration-300 hover:border-bronze-light hover:bg-bronze hover:text-ivory"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-bronze-light">
            Navigation
          </p>
          <ul className="mt-5 space-y-3">
            {nav.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group text-sm text-ivory/65 transition-colors hover:text-ivory"
                >
                  <span className="mr-2 inline-block h-px w-3 bg-bronze-light/50 align-middle transition-all duration-300 group-hover:w-5 group-hover:bg-bronze-light" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-bronze-light">
            Infos pratiques
          </p>
          <ul className="mt-5 space-y-4 text-sm text-ivory/65">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-light" />
              Rue Houcine Bouzaiene, à côté du Théâtre de l&apos;Étoile du Nord, Centre-Ville, Tunis
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-bronze-light" />
              <a href="tel:+21629311109" className="transition-colors hover:text-ivory">
                +216 29 311 109
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-bronze-light" />
              Lun – Sam · 09:00 – 19:00
              <br />
            </li>
          </ul>
          <Link
            href="/admin"
            className="mt-6 inline-block rounded-full border border-ivory/20 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.24em] text-ivory/60 transition-colors hover:border-bronze-light hover:text-ivory"
          >
            Espace pro
          </Link>
        </div>
      </div>

      <div aria-hidden className="select-none overflow-hidden leading-none">
        <p className="text-outline -mb-[4vw] text-center font-serif text-[24vw] font-medium italic tracking-tight">
          Salwa
        </p>
      </div>

      <div className="relative border-t border-ivory/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-ivory/45 sm:flex-row md:px-10">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p>© 2026 Salon Salwa de Coiffure &amp; d&apos;Esthétique — Tunis. Tous droits réservés.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/legal/mentions-legales" className="transition-colors hover:text-ivory">
                Mentions légales
              </Link>
              <span aria-hidden className="h-1 w-1 rotate-45 bg-bronze-light/60" />
              <Link href="/legal/confidentialite" className="transition-colors hover:text-ivory">
                Confidentialité
              </Link>
              <span aria-hidden className="h-1 w-1 rotate-45 bg-bronze-light/60" />
              <Link href="/legal/cgv" className="transition-colors hover:text-ivory">
                CGV
              </Link>
            </div>
          </div>
          <a
            href="#accueil"
            aria-label="Retour en haut de page"
            className="group grid h-10 w-10 place-items-center rounded-full border border-ivory/20 transition-colors hover:border-bronze-light hover:bg-bronze"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
