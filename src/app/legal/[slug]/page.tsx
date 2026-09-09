import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { findLegalDoc, legalDocs } from "@/lib/legal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp } from "@/components/Reveal";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = findLegalDoc(slug);
  return {
    title: doc ? `${doc.title} — Salon Salwa` : "Document juridique — Salon Salwa",
    description: doc?.intro,
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = findLegalDoc(slug);
  if (!doc) notFound();

  const others = legalDocs.filter((d) => d.slug !== doc.slug);

  return (
    <>
      <Navbar />
      <main className="bg-ivory pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <FadeUp>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-bronze">
              <span className="h-px w-10 bg-bronze/70" />
              {doc.eyebrow}
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-serif text-[clamp(2rem,5vw,3.4rem)] leading-tight tracking-tight">
              {doc.title}
            </h1>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="mt-5 text-base leading-relaxed text-espresso/70">{doc.intro}</p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso/40">
              Dernière mise à jour : {doc.updated}
            </p>
          </FadeUp>

          <div className="mt-12 space-y-10 border-t border-espresso/10 pt-10">
            {doc.sections.map((s, i) => (
              <FadeUp key={s.heading} delay={Math.min(i * 0.05, 0.3)}>
                <section>
                  <h2 className="font-serif text-2xl tracking-tight text-espresso">{s.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {s.body.map((p, j) => (
                      <p key={j} className="text-sm leading-relaxed text-espresso/70">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.15}>
            <div className="mt-14 rounded-2xl border border-bronze/30 bg-cream/60 p-6">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-bronze">
                <ShieldCheck className="h-4 w-4" />
                Une question ?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-espresso/70">
                Pour toute précision sur ces informations, appelez-nous au{" "}
                <a href="tel:+21629311109" className="font-semibold text-bronze">
                  +216 29 311 109
                </a>{" "}
                ou passez nous voir au salon, rue Houcine Bouzaiene à Tunis.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-espresso/10 pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso/60 transition-colors hover:text-bronze"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au site
              </Link>
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/legal/${o.slug}`}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze underline underline-offset-4"
                >
                  {o.title}
                </Link>
              ))}
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
