import Image from "next/image";
import { Gem, MapPin, Scissors } from "lucide-react";
import { FadeUp, SectionHeader } from "./Reveal";

const features = [
  {
    icon: Scissors,
    title: "Savoir-faire complet",
    text: "Coiffure, colorimétrie et soins esthétiques réunis sous un même toit.",
  },
  {
    icon: Gem,
    title: "Produits professionnels",
    text: "Kérastase, L'Oréal Pro et gammes premium sélectionnées avec soin.",
  },
  {
    icon: MapPin,
    title: "Emplacement idéal",
    text: "À deux pas du Théâtre de l'Étoile du Nord, en plein centre-ville de Tunis.",
  },
];

const stats = [
  { value: "12+", label: "années de passion" },
  { value: "2,3K", label: "clientes fidèles" },
  { value: "82%", label: "nous recommandent" },
  { value: "500+", label: "mariées sublimées" },
];

export default function About() {
  return (
    <section id="salon" className="relative scroll-mt-24 bg-ivory py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 md:grid-cols-2 md:px-10">
        <div>
          <SectionHeader
            eyebrow="Le Salon"
            title={
              <>
                Un écrin de beauté{" "}
                <span className="italic text-bronze">au cœur de Tunis</span>
              </>
            }
            description="Niché rue Houcine Bouzaiene, à côté du Théâtre de l'Étoile du Nord, le Salon Salwa est l'adresse des Tunisoises qui veulent le meilleur pour leurs cheveux et leur peau."
          />

          <FadeUp delay={0.25}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-espresso/65">
              Depuis plus de dix ans, notre équipe accueille chaque cliente comme une amie :
              écoute attentive, diagnostic personnalisé et gestes précis. Ici, chaque détail
              compte — de l&apos;accueil au dernier coup de brosse.
            </p>
          </FadeUp>

          <div className="mt-10 space-y-6">
            {features.map((f, i) => (
              <FadeUp key={f.title} delay={0.1 + i * 0.08}>
                <div className="group flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-bronze/40 text-bronze transition-all duration-300 group-hover:bg-bronze group-hover:text-ivory">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl tracking-tight">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-espresso/60">{f.text}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3}>
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-espresso/10 pt-10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-4xl tracking-tight text-bronze">{s.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15} className="relative md:sticky md:top-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2rem] rounded-t-[12rem] shadow-[0_40px_80px_-40px_rgba(60,45,33,0.5)]">
            <Image
              src="/images/salon-interior.jpg"
              alt="Intérieur chaleureux du Salon Salwa"
              fill
              className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>

          <div className="animate-float absolute -left-3 bottom-14 w-40 rotate-[-5deg] overflow-hidden rounded-2xl border-4 border-ivory shadow-2xl md:-left-10 md:w-52">
            <div className="relative aspect-square">
              <Image
                src="/images/hair-color.jpg"
                alt="Balayage caramel réalisé au salon"
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
          </div>

          <div className="absolute -bottom-6 right-4 max-w-[240px] rounded-2xl bg-espresso p-5 text-ivory shadow-xl md:-right-6">
            <p className="font-serif text-lg italic leading-snug">
              « Notre devise : il est toujours temps de se faire plus belle. »
            </p>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze-light">
              — Salwa
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
