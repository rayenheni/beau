import { Quote, Star } from "lucide-react";
import { FadeUp, SectionHeader } from "./Reveal";
import { FacebookIcon } from "./BrandIcons";
import { SALON } from "@/lib/salon";

const reviews = [
  {
    name: "Amira B.",
    service: "Balayage & soin",
    text: "Un balayage magnifique, exactement ce que je voulais. L'équipe est d'une gentillesse rare et le salon est impeccable. Je ne confie mes cheveux à personne d'autre.",
  },
  {
    name: "Sonia T.",
    service: "Formule mariée",
    text: "Salwa a fait de moi la plus belle des mariées. Chignon parfait, maquillage impeccable jusqu'à la fin de la nuit. Merci infiniment pour votre douceur et votre talent.",
  },
  {
    name: "Yasmine K.",
    service: "Lissage kératine",
    text: "Lissage impeccable, mes cheveux sont enfin domptés et brillants. Ponctualité, hygiène et professionnalisme au rendez-vous. Je recommande vivement.",
  },
];

export default function Testimonials() {
  return (
    <section id="avis" className="scroll-mt-24 bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          align="center"
          eyebrow="Elles nous confient leur beauté"
          title={
            <>
              Des clientes <span className="italic text-bronze">conquises</span>
            </>
          }
          description="Votre sourire en sortant du salon est notre plus belle récompense."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <FadeUp key={r.name} delay={i * 0.1}>
              <article className="group flex h-full flex-col rounded-3xl border border-espresso/8 bg-ivory p-8 shadow-[0_20px_50px_-35px_rgba(60,45,33,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(60,45,33,0.45)]">
                <Quote className="h-7 w-7 text-bronze/50 transition-colors group-hover:text-bronze" />
                <p className="mt-5 flex-1 font-serif text-lg italic leading-relaxed text-espresso/85">
                  « {r.text} »
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-espresso/10 pt-5">
                  <div>
                    <p className="text-sm font-bold text-espresso">{r.name}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/45">
                      {r.service}
                    </p>
                  </div>
                  <span className="flex text-bronze">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2}>
          <a
            href={SALON.facebook}
            target="_blank"
            rel="noreferrer"
            className="group mx-auto mt-10 flex w-fit items-center gap-4 rounded-full border border-espresso/12 bg-ivory px-7 py-4 transition-all duration-300 hover:border-bronze"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-ivory transition-colors group-hover:bg-bronze">
              <FacebookIcon className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-medium text-espresso/75">
              <strong className="font-semibold text-espresso">82&nbsp;% de recommandations</strong>{" "}
              — rejoignez nos 2,3&nbsp;K abonnées sur Facebook
            </span>
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
