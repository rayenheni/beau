#!/usr/bin/env node
/**
 * Assistant d'onboarding — un déploiement = un salon.
 *
 * Usage : npm run new-client
 *
 * Pose les questions minimales, génère un mot de passe admin fort,
 * écrit .env.local et affiche la checklist Vercel à copier-coller.
 * Ne touche ni au code ni à la base de données.
 */
import { randomBytes } from "node:crypto";
import { writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, def = "") =>
  new Promise((res) =>
    rl.question(def ? `${q} [${def}] ` : `${q} `, (a) => res(a.trim() || def))
  );

const yn = (q, def = true) =>
  new Promise((res) =>
    rl.question(`${q} [${def ? "O/n" : "o/N"}] `, (a) => {
      const v = a.trim().toLowerCase();
      if (!v) return res(def);
      res(["o", "oui", "y", "yes"].includes(v));
    })
  );

console.log("\n── Nouveau salon · onboarding ──────────────────────────────\n");

const name = await ask("Nom complet du salon", "Salon Exemple de Coiffure & d'Esthétique");
const shortName = await ask("Nom court (logo, messages)", name.replace(/^Salon\s+/i, "").split(" ")[0] || "Exemple");
const city = await ask("Ville", "Tunis");
const tagline = await ask("Baseline sous le logo", "Coiffure · Esthétique");
const phoneDisplay = await ask("Téléphone affiché", "+216 20 000 000");
const digits = phoneDisplay.replace(/\D/g, "");
const phone = await ask("Téléphone international (tel:)", `+${digits}`);
const whatsapp = await ask("Numéro WhatsApp (chiffres seuls)", digits);
const address = await ask("Adresse complète", "Avenue Habib Bourguiba, Tunis");
const addressShort = await ask("Adresse courte", `${city} Centre`);
const refPrefix = (await ask("Préfixe des références (2-4 lettres)", "SE")).toUpperCase().slice(0, 4);
const slug = await ask(
  "Slug (fichiers, e-mails)",
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "salon-exemple"
);
const domain = await ask("Domaine (sans https://)", "exemple.tn");
const siteUrl = await ask("URL publique du site", `https://www.${domain}`);
const facebook = await ask("URL Facebook (vide = masqué)", "");
const instagram = await ask("URL Instagram (vide = masqué)", "");
const instaHandle = instagram
  ? await ask("Pseudo Instagram affiché", `@${slug}`)
  : "";
const mapsUrl = await ask("Lien Google Maps (partager → copier le lien)", `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " " + city)}`);
const useMail = await yn("Configurer les alertes e-mail (Resend) ?", false);
let resendKey = "", mailFrom = "", mailTo = "";
if (useMail) {
  resendKey = await ask("RESEND_API_KEY");
  mailFrom = await ask("MAIL_FROM", `reservations@${domain}`);
  mailTo = await ask("MAIL_TO (e-mail du salon)");
}
const databaseUrl = await ask("DATABASE_URL (Neon du client, vide = à compléter)", "");
const adminPassword = randomBytes(24).toString("base64url");

const env = `# Généré par npm run new-client — ${new Date().toISOString().slice(0, 10)}
# Salon : ${name}
DATABASE_URL=${databaseUrl || "postgresql://A_COMPLETER"}
ADMIN_PASSWORD=${adminPassword}

NEXT_PUBLIC_SITE_URL=${siteUrl}
NEXT_PUBLIC_SALON_NAME=${name}
NEXT_PUBLIC_SALON_SHORT_NAME=${shortName}
NEXT_PUBLIC_SALON_TAGLINE=${tagline}
NEXT_PUBLIC_SALON_CITY=${city}
NEXT_PUBLIC_SALON_SLOGAN=Il est toujours temps de se faire plus belle.
NEXT_PUBLIC_SALON_DESCRIPTION=${tagline} à ${city}. Réservation en ligne.
NEXT_PUBLIC_SALON_PHONE=${phone}
NEXT_PUBLIC_SALON_PHONE_DISPLAY=${phoneDisplay}
NEXT_PUBLIC_SALON_WHATSAPP=${whatsapp}
NEXT_PUBLIC_SALON_ADDRESS=${address}
NEXT_PUBLIC_SALON_ADDRESS_SHORT=${addressShort}
NEXT_PUBLIC_SALON_REF_PREFIX=${refPrefix}
NEXT_PUBLIC_SALON_DOMAIN=${domain}
NEXT_PUBLIC_SALON_SLUG=${slug}
NEXT_PUBLIC_SALON_FACEBOOK=${facebook}
NEXT_PUBLIC_SALON_FACEBOOK_REVIEWS=${facebook ? facebook.replace(/\/?$/, "/reviews") : ""}
NEXT_PUBLIC_SALON_INSTAGRAM=${instagram}
NEXT_PUBLIC_SALON_INSTAGRAM_HANDLE=${instaHandle}
NEXT_PUBLIC_SALON_MAPS_URL=${mapsUrl}
NEXT_PUBLIC_SALON_MAPS_EMBED=${mapsUrl}
NEXT_PUBLIC_SALON_KEYWORDS=salon de coiffure ${city.toLowerCase()},coiffure esthétique ${city.toLowerCase()}
${useMail ? `RESEND_API_KEY=${resendKey}\nMAIL_FROM=${mailFrom}\nMAIL_TO=${mailTo}\n` : `# RESEND_API_KEY=\n# MAIL_FROM=\n# MAIL_TO=\n`}`;

if (existsSync(".env.local")) {
  const overwrite = await yn("⚠️  .env.local existe déjà. L'écraser ?", false);
  if (!overwrite) {
    console.log("\nAbandon — .env.local inchangé. Relancez après sauvegarde.\n");
    rl.close();
    process.exit(0);
  }
}
writeFileSync(".env.local", env);

console.log("\n✅ .env.local écrit.\n");
console.log("── À copier dans Vercel (Settings → Environment Variables) ──\n");
console.log(env);
console.log("\n── Mot de passe espace pro (à remettre au salon) ──");
console.log(`   ${adminPassword}\n`);
console.log("── Suite (guide complet : docs/ONBOARDING.md) ──");
console.log("   1. Créer les tables :  DATABASE_URL=\"...\" npm run db:push");
console.log("   2. Démo :              DATABASE_URL=\"...\" npm run seed:demo");
console.log("   3. Tester :            npm run dev  →  http://localhost:3000");
console.log("   4. Déployer sur le compte Vercel DU CLIENT + domaine .tn");
console.log("   5. Avant remise :      DATABASE_URL=\"...\" npm run seed:clear\n");
rl.close();
