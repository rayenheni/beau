import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { FadeUp, SectionHeader } from "./Reveal";
import { FacebookIcon, InstagramIcon } from "./BrandIcons";

const infos = [
  {
    icon: MapPin,
    label: "Adresse",
    lines: ["Rue Houcine Bouzaiene, à côté du", "Théâtre de l'Étoile du Nord, Centre-Ville — Tunis"],
    href: "https://www.google.com/maps/search/?api=1&query=Th%C3%A9%C3%A2tre+de+l%27%C3%89toile+du+Nord+Tunis",
    hrefLabel: "Itinéraire",
  },
  {
    icon: Phone,
    label: "Téléphone",
    lines: ["+216 29 311 109"],
    href: "tel:+21629311109",
    hrefLabel: "Appeler",
  },
  {
    icon: Clock,
    label: "Horaires",
    lines: ["Lundi – Samedi : 09:00 – 19:00", "Dimanche : sur rendez-vous"],
  },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 md:grid-cols-2 md:px-10">
        <div>
          <SectionHeader
            eyebrow="Nous trouver"
            title={
              <>
                À deux pas de{" "}
                <span className="italic text-bronze">l&apos;Étoile du Nord</span>
              </>
            }
            description="Le salon vous accueille au cœur du centre-ville de Tunis, dans un cadre chaleureux et intimiste. Passez nous voir, l'accueil est toujours avec le sourire."
          />

          <div className="mt-10 space-y-7">
            {infos.map((info, i) => (
              <FadeUp key={info.label} delay={0.1 + i * 0.08}>
                <div className="flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-bronze/40 text-bronze">
                    <info.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-espresso/45">
                      {info.label}
                    </p>
                    {info.lines.map((l) => (
                      <p key={l} className="mt-0.5 text-sm font-medium text-espresso/80">
                        {l}
                      </p>
                    ))}
                    {info.href && (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-bronze"
                      >
                        {info.hrefLabel}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}

            <FadeUp delay={0.35}>
              <div className="flex items-center gap-4 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-espresso/45">
                  Suivez-nous
                </p>
                <span className="h-px w-8 bg-espresso/20" />
                <a
                  href="https://www.facebook.com/p/Salon-Salwa-de-Coiffure-dEsth%C3%A9tique-100063708455598/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook du salon"
                  className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15 text-espresso/70 transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/salon.salwa/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram du salon"
                  className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15 text-espresso/70 transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay={0.2} className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-espresso/10 shadow-[0_40px_80px_-45px_rgba(60,45,33,0.5)]">
            <iframe
              title="Plan d'accès — Salon Salwa, rue Houcine Bouzaiene, Tunis"
              src="https://www.google.com/maps?q=Th%C3%A9%C3%A2tre%20de%20l'%C3%89toile%20du%20Nord%2C%20Tunis%2C%20Tunisie&z=16&output=embed"
              className="map-frame h-[420px] w-full md:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="absolute -bottom-5 left-6 rounded-2xl bg-espresso px-6 py-4 text-ivory shadow-xl md:left-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze-light">
              Salon Salwa
            </p>
            <p className="mt-1 font-serif text-lg italic">Centre-Ville, Tunis</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
