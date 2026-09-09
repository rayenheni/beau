import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Un déploiement = un salon : la cible est TOUJOURS la variable d'environnement
 * DATABASE_URL (compte Neon du client), jamais une URL en dur.
 *
 * Usage : DATABASE_URL="<url-neon-du-client>" npm run db:push
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
