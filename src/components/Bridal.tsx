import Image from "next/image";
import { Check } from "lucide-react";
import { FadeUp, SectionHeader } from "./Reveal";
import BookButton from "./BookButton";

const included = [
  "Essai coiffure & maquillage avant le grand jour",
  "Chignon, tirbana ou coiffure traditionnelle",
  "Maquillage longue tenue, résistant aux émotions",
  "Accompagnement à domicile sur demande",
  "Formules pour la maman, les sœurs & le cortège",
];

export default function Bridal() {
  return (
    <section id="mariees" className="relative overflow-hidden bg-espresso py-24 text-ivory md:py-32">
      <div
        aria-hidden
        className="absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-bronze/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-rose/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <div>
          <SectionHeader
            dark
            eyebrow="Mariées & grandes occasions"
            title={
              <>
                Sublimez le{" "}
                <span className="italic text-bronze-light">plus beau jour</span> de votre vie
              </>
            }
            description="Du premier essayage à la dernière retouche avant la salle des fêtes, nous préparons chaque mariée comme une œuvre d'art. Heniyya, warka, soirée : chaque étape de vos festivités mérite sa mise en beauté."
          />

          <div className="mt-10 space-y-4">
            {included.map((item, i) => (
              <FadeUp key={item} delay={0.1 + i * 0.07}>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-bronze text-espresso">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <p className="text-sm leading-relaxed text-ivory/80 md:text-base">{item}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3}>
            <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-ivory/10 bg-ivory/5 p-7 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-bronze-light">
                  Formule Mariée
                </p>
                <p className="mt-2 font-serif text-4xl tracking-tight">
                  dès 350 <span className="text-2xl italic text-bronze-light">DT</span>
                </p>
                <p className="mt-1 text-xs text-ivory/50">
                  Incluant l&apos;essai — devis personnalisé selon vos envies
                </p>
              </div>
              <BookButton
                serviceId="essai-mariee"
                label="Réserver un essai"
                variant="light"
                className="shrink-0 !px-6 !py-3.5 !text-[11px]"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <p className="mt-8 max-w-md font-serif text-lg italic leading-snug text-ivory/70">
              « Salwa a fait de moi la plus belle des mariées. Chignon parfait, maquillage
              impeccable jusqu&apos;à la fin de la nuit. »
              <span className="mt-2 block text-xs not-italic tracking-[0.3em] text-bronze-light">
                — NOUR E. MARIÉE EN JUIN 2025
              </span>
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.2} className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[3/4] overflow-hidden rounded-b-[2rem] rounded-t-[13rem] border border-bronze/40 p-3">
            <div className="relative h-full w-full overflow-hidden rounded-b-[1.6rem] rounded-t-[11.5rem]">
              <Image
                src="/images/bride.jpg"
                alt="Chignon de mariée signé Salon Salwa"
                fill
                className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </div>
          </div>

          <div className="absolute -bottom-8 -left-6 w-36 rotate-[5deg] overflow-hidden rounded-2xl border-4 border-ivory shadow-2xl md:-left-14 md:w-44">
            <div className="relative aspect-square">
              <Image
                src="/images/makeup.jpg"
                alt="Maquillage de mariée lumineux"
                fill
                className="object-cover"
                sizes="190px"
              />
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-bronze-light/40"
          />
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-bronze-light/20"
          />
        </FadeUp>
      </div>
    </section>
  );
}
