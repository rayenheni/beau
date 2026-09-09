import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Salon Salwa · Coiffure & Esthétique — Tunis",
  description:
    "Salon de coiffure & d'esthétique au cœur du centre-ville de Tunis. Balayage, lissage kératine, chignons de mariée, maquillage, soins du visage, manucure. Il est toujours temps de se faire plus belle.",
  keywords: [
    "salon de coiffure tunis",
    "coiffure esthétique tunis",
    "balayage tunis",
    "lissage kératine tunis",
    "maquillage mariée tunis",
    "salon salwa",
  ],
  openGraph: {
    title: "Salon Salwa · Coiffure & Esthétique — Tunis",
    description:
      "Il est toujours temps de se faire plus belle. Salon de coiffure & d'esthétique au centre-ville de Tunis.",
    images: ["/images/hero.jpg"],
    locale: "fr_TN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Salon Salwa de Coiffure & d'Esthétique",
  slogan: "Il est toujours temps de se faire plus belle",
  telephone: "+21629311109",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue Houcine Bouzaiene, à côté du Théâtre de l'Étoile du Nord, Centre-Ville",
    addressLocality: "Tunis",
    addressCountry: "TN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/p/Salon-Salwa-de-Coiffure-dEsth%C3%A9tique-100063708455598/",
    "https://www.instagram.com/salon.salwa/",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="bg-ivory font-sans text-espresso antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
