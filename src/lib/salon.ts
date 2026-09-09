/**
 * ============================================================================
 *  CONFIGURATION CENTRALE DU SALON — le seul fichier "métier" à adapter.
 * ============================================================================
 *
 * Modèle commercial : UN DÉPLOIEMENT = UN CLIENT.
 * Chaque salon a sa propre instance (sa propre base de données, son propre
 * hébergement payé par lui) et sa propre configuration.
 *
 * Toutes les valeurs se règlent par variables d'environnement
 * (préfixe NEXT_PUBLIC_ = lisible côté navigateur, sans secret).
 * Les valeurs par défaut ci-dessous correspondent au client pilote
 * (Salon Salwa, Tunis) et permettent de lancer le site en local sans config.
 *
 * Pour onboarder un nouveau salon :
 *   1. `npm run new-client` (génère les variables + le mot de passe admin)
 *   2. Renseigner les variables sur Vercel (voir docs/ONBOARDING.md)
 *   3. Remplacer le catalogue (src/lib/services.ts) + les photos (public/images/)
 *
 * ⚠️  Ne jamais mettre de secret ici (pas de ADMIN_PASSWORD, pas de DATABASE_URL).
 */

function env(key: string, fallback: string): string {
  const v = process.env[key];
  return v !== undefined && v.trim().length > 0 ? v.trim() : fallback;
}

export const SALON = {
  /** Nom complet — SEO, mentions légales, e-mails, confirmations. */
  name: env("NEXT_PUBLIC_SALON_NAME", "Salon Salwa de Coiffure & d'Esthétique"),

  /** Nom court — logo, signatures, messages WhatsApp. */
  shortName: env("NEXT_PUBLIC_SALON_SHORT_NAME", "Salwa"),

  /** Baseline sous le logo. Ex : "Coiffure · Esthétique". */
  tagline: env("NEXT_PUBLIC_SALON_TAGLINE", "Coiffure · Esthétique"),

  /** Ville — hero, contact, SEO local. */
  city: env("NEXT_PUBLIC_SALON_CITY", "Tunis"),

  /** Devise / slogan affiché en hero et dans le pied de page. */
  slogan: env(
    "NEXT_PUBLIC_SALON_SLOGAN",
    "Il est toujours temps de se faire plus belle."
  ),

  /** Description courte — SEO + section contact. */
  description: env(
    "NEXT_PUBLIC_SALON_DESCRIPTION",
    "Salon de coiffure & d'esthétique au cœur du centre-ville de Tunis. Balayage, lissage kératine, chignons de mariée, maquillage, soins du visage, manucure."
  ),

  /** Téléphone au format international — liens tel:. Ex : +21629311109 */
  phone: env("NEXT_PUBLIC_SALON_PHONE", "+21629311109"),

  /** Téléphone lisible — affichage. Ex : +216 29 311 109 */
  phoneDisplay: env("NEXT_PUBLIC_SALON_PHONE_DISPLAY", "+216 29 311 109"),

  /** Numéro WhatsApp (chiffres seuls, indicatif inclus) — liens wa.me. */
  phoneWhatsApp: env("NEXT_PUBLIC_SALON_WHATSAPP", "21629311109"),

  /** Adresse complète — contact, mentions légales, pied de page. */
  address: env(
    "NEXT_PUBLIC_SALON_ADDRESS",
    "Rue Houcine Bouzaiene, à côté du Théâtre de l'Étoile du Nord, Centre-Ville, Tunis"
  ),

  /** Adresse courte — pastilles, menus. Ex : "Centre-Ville, Tunis". */
  addressShort: env("NEXT_PUBLIC_SALON_ADDRESS_SHORT", "Centre-Ville, Tunis"),

  /**
   * Préfixe des références de réservation (2–4 lettres).
   * Ex : SW → SW-XXXXX. Choisir les initiales du salon.
   */
  refPrefix: env("NEXT_PUBLIC_SALON_REF_PREFIX", "SW"),

  /** Domaine du salon (sans https://) — UID des exports agenda. */
  domain: env("NEXT_PUBLIC_SALON_DOMAIN", "salonsalwa.tn"),

  /** Slug — noms de fichiers exportés (CSV, .ics). Ex : salon-salwa */
  slug: env("NEXT_PUBLIC_SALON_SLUG", "salon-salwa"),

  /** URL publique du site (sans slash final) — SEO, sitemap. */
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),

  /** Réseaux sociaux. Laisser vide ("") pour masquer un bouton. */
  facebook: env(
    "NEXT_PUBLIC_SALON_FACEBOOK",
    "https://www.facebook.com/p/Salon-Salwa-de-Coiffure-dEsth%C3%A9tique-100063708455598/"
  ),
  facebookReviews: env(
    "NEXT_PUBLIC_SALON_FACEBOOK_REVIEWS",
    "https://www.facebook.com/p/Salon-Salwa-de-Coiffure-dEsth%C3%A9tique-100063708455598/reviews"
  ),
  instagram: env(
    "NEXT_PUBLIC_SALON_INSTAGRAM",
    "https://www.instagram.com/salon.salwa/"
  ),
  instagramHandle: env(
    "NEXT_PUBLIC_SALON_INSTAGRAM_HANDLE",
    "@salon.salwa"
  ),

  /** Google Maps — bouton itinéraire + carte intégrée. */
  mapsUrl: env(
    "NEXT_PUBLIC_SALON_MAPS_URL",
    "https://www.google.com/maps/search/?api=1&query=Th%C3%A9%C3%A2tre+de+l%27%C3%89toile+du+Nord+Tunis"
  ),
  mapsEmbed: env(
    "NEXT_PUBLIC_SALON_MAPS_EMBED",
    "https://www.google.com/maps?q=Th%C3%A9%C3%A2tre%20de%20l'%C3%89toile%20du%20Nord%2C%20Tunis%2C%20Tunisie&z=16&output=embed"
  ),

  /** Mots-clés SEO — compléter par ville + spécialités du salon. */
  keywords: env(
    "NEXT_PUBLIC_SALON_KEYWORDS",
    "salon de coiffure tunis,coiffure esthétique tunis,balayage tunis,lissage kératine tunis,maquillage mariée tunis"
  )
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean),
};

export type SalonConfig = typeof SALON;
