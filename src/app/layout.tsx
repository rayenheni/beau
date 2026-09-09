import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SALON } from "@/lib/salon";
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
