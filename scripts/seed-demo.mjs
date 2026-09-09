#!/usr/bin/env node
/**
 * Jeu de démonstration — remplit une base fraiche pour vendre le produit.
 *
 * Usage :
 *   DATABASE_URL="..." npm run seed:demo    → insère réglages + ~14 RDV + alertes
 *   DATABASE_URL="..." npm run seed:clear    → vide RDV + alertes (avant remise au salon)
 *
 * Lit DATABASE_URL depuis l'environnement, .env.local puis .env.
 * N'écrase jamais les réglages existants (INSERT ... ON CONFLICT DO NOTHING).
 */
import { readFileSync, existsSync } from "node:fs";
import pg from "pg";

const CLEAR = process.argv.includes("--clear");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnvFile(".env.local");
loadEnvFile(".env");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || DATABASE_URL.includes("A_COMPLETER")) {
  console.error("❌ DATABASE_URL manquant. Ex : DATABASE_URL=\"...\" npm run seed:demo");
  process.exit(1);
}
const PREFIX = (process.env.NEXT_PUBLIC_SALON_REF_PREFIX || "SW").toUpperCase();

const { Client } = pg;
const db = new Client({ connectionString: DATABASE_URL });
await db.connect();

if (CLEAR) {
  await db.query("TRUNCATE notifications, appointments");
  console.log("✅ Base vidée (appointments + notifications). Réglages conservés.");
  await db.end();
  process.exit(0);
}

const { rows: existing } = await db.query("SELECT count(*)::int AS n FROM appointments");
if (existing[0].n > 0) {
  console.error(`❌ La base contient déjà ${existing[0].n} rendez-vous. Annulation (sécurité).`);
  console.error("   Pour forcer : npm run seed:clear puis npm run seed:demo");
  await db.end();
  process.exit(1);
}

await db.query(
  `INSERT INTO salon_settings (id, max_parallel, buffer_minutes, open_minutes, close_minutes, closed_weekdays)
   VALUES (1, 2, 10, 540, 1140, '0') ON CONFLICT (id) DO NOTHING`
);

const ALPHA = "ACDEFGHJKLMNPQRTUVWXY34679";
const ref = () =>
  `${PREFIX}-${Array.from({ length: 5 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join("")}`;

const dstr = (offsetDays) => {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" });
};

// [nom, téléphone, prestation, minutes, prix, décalage jours, heure, statut]
const DEMO = [
  ["Amira Ben Salah", "+216 98 412 336", "Balayage & mèches", 150, 150, -6, "10:00", "done"],
  ["Yasmine Trabelsi", "+216 27 553 901", "Coupe signature", 60, 50, -5, "14:30", "done"],
  ["Mariem Gharbi", "+216 96 220 418", "Lissage à la kératine", 180, 300, -3, "09:30", "done"],
  ["Ines Bouzid", "+216 29 874 552", "Soin du visage éclat", 60, 70, -2, "16:00", "done"],
  ["Syrine Mansour", "+216 55 341 789", "Brushing & coiffage", 45, 25, -1, "11:00", "cancelled"],
  ["Khouloud Ayari", "+216 98 765 234", "Coloration complète", 120, 100, 0, "09:00", "confirmed"],
  ["Rania Khelifi", "+216 22 456 908", "Maquillage soirée", 75, 90, 0, "15:30", "confirmed"],
  ["Nour Hedhli", "+216 97 123 654", "Manucure & vernis semi-permanent", 75, 55, 0, "17:00", "pending"],
  ["Sana Dridi", "+216 94 567 321", "Épilation complète", 60, 60, 1, "10:30", "pending"],
  ["Olfa Zairi", "+216 26 789 432", "Botox capillaire", 120, 180, 1, "14:00", "confirmed"],
  ["Hiba Jlassi", "+216 99 234 567", "Chignon soirée", 60, 80, 2, "18:00", "pending"],
  ["Manel Ferchichi", "+216 58 345 678", "Ombré hair & AirTouch", 180, 220, 3, "09:30", "pending"],
  ["Dorsaf Mlika", "+216 93 456 789", "Essai coiffure & maquillage mariée", 120, 150, 5, "11:00", "confirmed"],
  ["Leïla Haddad", "+216 20 567 890", "Soin du visage éclat", 60, 70, 7, "16:30", "pending"],
];

for (const [name, phone, service, minutes, price, off, time, status] of DEMO) {
  const reference = ref();
  const { rows } = await db.query(
    `INSERT INTO appointments (reference, name, phone, service, minutes, price_value, date, time, status, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [
      reference,
      name,
      phone,
      service,
      minutes,
      price,
      dstr(off),
      time,
      status,
      status === "pending" && off >= 0 ? "Première visite — prévoir un diagnostic." : null,
    ]
  );
  if (status === "pending" && off >= 0) {
    await db.query(
      `INSERT INTO notifications (appointment_id, type, title, body) VALUES ($1,'new_booking',$2,$3)`,
      [rows[0].id, `Nouvelle demande — ${service}`, `${name} · ${dstr(off)} à ${time} · ${phone}`]
    );
  }
  console.log(`   ${reference}  ${name} — ${service} — ${dstr(off)} ${time} [${status}]`);
}

console.log(`\n✅ Démo insérée (${DEMO.length} rendez-vous). Ouvrez /admin pour présenter.`);
console.log("   Avant remise au salon : npm run seed:clear\n");
await db.end();
