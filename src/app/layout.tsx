import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SALON } from "@/lib/salon";
// Polices auto-hébergées (Fontsource) : aucun appel à Google Fonts,
// site plus rapide et aucune donnée transmise à un tiers (INPDP-friendly).
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";

const pageTitle = `${SALON.name} — ${SALON.city}`;

export const metadata: Metadata = {
  metadataBase: new URL(SALON.siteUrl),
  title: pageTitle,
  description: SALON.description,
  keywords: SALON.keywords,
  openGraph: {
    title: pageTitle,
    description: SALON.slogan,
    images: ["/images/hero.jpg"],
    locale: "fr_TN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: SALON.name,
  slogan: SALON.slogan,
  telephone: SALON.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SALON.address,
    addressLocality: SALON.city,
    addressCountry: "TN",
  },
  sameAs: [SALON.facebook, SALON.instagram].filter(Boolean),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
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
