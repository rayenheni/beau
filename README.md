# Salon Salwa — Site vitrine & réservation en ligne

Site web complet pour salon de coiffure et d'esthétique : présentation éditoriale,
diagnostic beauté personnalisé, réservation en ligne avec créneaux en temps réel,
espace professionnel protégé et libre-service client.

---

## 1. Fonctionnalités

### Côté cliente (public)

| Fonctionnalité | Détail |
| --- | --- |
| **Réservation en 3 étapes** | Prestation → date & heure → coordonnées, avec récapitulatif vivant |
| **Disponibilités réelles** | Créneaux complets barrés en direct (capacité réglable par créneau) |
| **Calendrier** | Navigation 6 mois, dates passées désactivées, jour courant signalé |
| **Référence de suivi** | Code unique `SW-XXXXX` copiable |
| **Libre-service** | Retrouver ses demandes par référence ou téléphone, annuler en autonomie |
| **Export agenda** | Fichier `.ics` à ajouter dans Google Calendar, Outlook, Apple Calendrier |
| **Confirmation WhatsApp** | Message pré-rempli avec le détail de la demande |
| **Diagnostic beauté** | Quiz de 4 questions → 3 prestations recommandées, réservation directe |
| **Galerie immersive** | Comparateur avant/après glissant + lightbox plein écran (clavier) |
| **Mobile** | Barre d'actions fixe : Appeler · WhatsApp · Réserver |

### Côté salon (protégé)

| Fonctionnalité | Détail |
| --- | --- |
| **Authentification** | Connexion par mot de passe, cookie signé HMAC-SHA256 (12 h) |
| **Tableau de bord** | Statistiques : total, en attente, confirmées, terminées |
| **Gestion des RDV** | Confirmer · marquer terminée · remettre en attente · annuler · supprimer |
| **Référence visible** | Le code client s'affiche pour faciliter les échanges téléphoniques |

### Robustesse

- Validation stricte de toutes les entrées avec **Zod** (messages en français).
- **Anti-conflit** : une réservation sur un créneau complet est refusée (HTTP 409).
- **Anti-spam** : limitation de débit en mémoire par adresse IP (6 demandes / 10 min).
- **Anti-force-brute** : comparaison en temps constant + délai sur échec de connexion.
- Fuseau horaire **Africa/Tunis** respecté (dates passées et créneaux dépassés bloqués).
- Accessibilité : `prefers-reduced-motion`, focus visibles, libellés ARIA, navigation clavier.

---

## 2. Stack technique

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript** strict
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **PostgreSQL** + **Drizzle ORM**
- **Zod** (validation)

---

## 3. Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer le salon (assistant interactif → génère .env.local)
npm run new-client

# 3. Créer les tables sur la base Neon DU CLIENT
DATABASE_URL="<connection-string-neon>" npm run db:push

# 4. (Optionnel) insérer un jeu de démo pour présenter le back-office
DATABASE_URL="<connection-string-neon>" npm run seed:demo

# 5. Lancer en développement
npm run dev
```

> **Nouveau client ?** Suivez le guide pas-à-pas : [`docs/ONBOARDING.md`](docs/ONBOARDING.md)
> (comptes, déploiement Vercel, domaine .tn, remise — 60 à 90 min).
> Modèle d'hébergement et coûts : [`docs/HOSTING.md`](docs/HOSTING.md).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rayenheni/beau&env=DATABASE_URL,ADMIN_PASSWORD,NEXT_PUBLIC_SITE_URL&project-name=salon-beaute&repository-name=salon-beaute)

### Variables d'environnement

| Variable | Rôle | Obligatoire |
| --- | --- | --- |
| `DATABASE_URL` | Connexion PostgreSQL | Oui |
| `ADMIN_PASSWORD` | Mot de passe de l'espace pro (`/admin`) | Oui |
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO, sitemap) | Recommandé |
| `NEXT_PUBLIC_SALON_*` | Identité du salon : nom, téléphones, adresse, préfixe de référence, réseaux sociaux, carte (liste complète dans `.env.example`) | Oui (défauts inclus) |
| `RESEND_API_KEY` | Envoi des alertes e-mail | Non |
| `MAIL_FROM` | Expéditeur des alertes | Non |
| `MAIL_TO` | Destinataire des alertes | Non |

> ⚠️ **Sans `ADMIN_PASSWORD` (min. 6 caractères), l'espace pro reste fermé et les routes
> de gestion renvoient une erreur 503.** C'est un choix de sécurité délibéré : il vaut
> mieux un back-office indisponible qu'un back-office ouvert à tous.
>
> 📌 **Important** : ces variables doivent être définies **sur le compte Vercel
> du client** (Settings → Environment Variables), pas seulement dans `.env.local`.
> Voir [`docs/ONBOARDING.md`](docs/ONBOARDING.md). Un fichier `.env*` n'est pas
> versionné et peut être réinitialisé selon l'hébergeur.

---

## 4. Structure du projet

```
src/
├── app/
│   ├── page.tsx                     Page d'accueil (assemblage des sections)
│   ├── layout.tsx                   Polices, métadonnées, JSON-LD BeautySalon
│   ├── robots.ts / sitemap.ts       SEO technique
│   ├── admin/
│   │   ├── page.tsx                 Tableau de bord (protégé)
│   │   └── login/page.tsx           Connexion
│   ├── legal/[slug]/page.tsx        Mentions légales · Confidentialité · CGV
│   └── api/
│       ├── appointments/            POST créer · GET retrouver (public)
│       ├── appointments/[id]/       PATCH / DELETE (protégé)
│       ├── appointments/cancel/     Annulation client (téléphone + référence)
│       ├── availability/            Créneaux complets d'une date
│       ├── admin/session/           Connexion / déconnexion
│       └── health/                  Healthcheck
├── components/                      Sections UI + utilitaires
├── db/                              Client Drizzle + schéma
└── lib/                             Catalogue, logique réservation, auth, juridique
```

---

## 5. Personnaliser pour un autre salon

Tout le contenu métier est centralisé dans deux fichiers :

| Fichier | Contenu | Comment |
| --- | --- | --- |
| Variables `NEXT_PUBLIC_SALON_*` | Nom, téléphones, adresse, slogan, réseaux, carte, SEO | Via `npm run new-client`, zéro code |
| `src/lib/salon.ts` | Valeurs par défaut de l'identité ci-dessus | Ne toucher qu'en dernier recours |
| `src/lib/services.ts` | Prestations, prix, durées, images, catégories | Contenu par client |
| `src/lib/legal.ts` | Mentions légales, confidentialité, CGV | + matricule fiscal du salon |
| `src/app/globals.css` | Palette de couleurs et typographies (`@theme`) | Optionnel, facturable |
| `public/images/` | Photographies | Mêmes noms = zéro code |
| `src/components/Testimonials.tsx` | Avis clientes | Contenu par client |

> ✅ **Zéro nom de salon en dur dans le code** : toute l'identité passe par
> `src/lib/salon.ts` (lire : les variables d'environnement). Vérifié par :
> `grep -ri "salwa" src --include="*.tsx" --include="ts" | grep -v salon.ts`
> (ne doivent rester que les citations d'avis, contenu par nature).

---

## 6. Positionnement commercial

### Ce que ce projet est

Un **site vitrine avec réservation en ligne**, prêt à être livré à un salon
indépendant. Le code est propriété de son auteur, ce qui autorise la revente
du site lui-même et la facturation de son installation.

### Modèles de vente possibles

| Modèle | Contenu | Fourchette indicative |
| --- | --- | --- |
| **Vente au forfait** | Site unique livré clé en main, hébergé sur le domaine du salon | Installation + mise en ligne |
| **Maintenance** | Mises à jour, sauvegardes, petites modifications de contenu | Abonnement mensuel ou annuel |
| **Déclinaison** | Réutilisation du socle pour un autre salon (nouvelle identité, nouveau catalogue) | Forfait réduit par rapport à une création |

### État réel du backend

Audit honnête, à jour du dernier développement :

| Brique | État | Détail |
| --- | --- | --- |
| Réservation + référence unique | ✅ Fait | Anti-conflit, anti-spam, validation Zod |
| **Anti-double-réservation par durée** | ✅ Fait | Une prestation de 4 h bloque réellement 4 h |
| Paramètres d'exploitation | ✅ Fait | Postes simultanés, marge, horaires, jours fermés — modifiables sans code |
| Alertes internes au salon | ✅ Fait | Cloche temps réel dans l'espace pro (polling 20 s) |
| Alertes e-mail | 🟡 Partiel | Code prêt (Resend), nécessite 3 variables d'environnement |
| Statistiques | ✅ Fait | CA, panier moyen, taux d'honoré, annulations, top prestations |
| Authentification | 🟡 Partiel | Un seul mot de passe partagé, pas d'utilisateurs nominatifs |
| Fiche cliente / historique | ❌ Manquant | Aucun profil client, aucun suivi des allergies |
| Acompte / paiement | ❌ Manquant | Rien n'empêche une cliente de ne pas se présenter |
| Rappels automatiques SMS/e-mail | ❌ Manquant | Aucun cron de rappel J-1 |
| Multi-tenant | ❌ Manquant | Un déploiement = un salon |
| Édition du catalogue par le salon | ❌ Manquant | Prestations et prix modifiables seulement dans le code |
| Marque blanche (1 déploiement = 1 client) | ✅ Fait | Identité 100 % par variables d'environnement |
| Pack d'installation répétable | ✅ Fait | `new-client`, `seed:demo`, guides ONBOARDING + HOSTING |
| Export CSV + fiche du jour imprimable | ✅ Fait | Depuis l'espace pro, par jour ou complet |
| Rappel WhatsApp en 1 clic | ✅ Fait | Message pré-rempli par rendez-vous |

**Conclusion** : le backend est **complet pour une installation mono-salon livrée
en forfait**, à condition d'accepter les limites listées. Il ne constitue **pas**
un produit SaaS revendable en série.

### Ce qui manque pour en faire un produit SaaS

Le projet est volontairement **mono-client**. Pour le vendre de façon répétée
et automatisée, il faudrait ajouter :

1. **Le multi-tenant** — un seul déploiement, plusieurs salons isolés (table
   `tenants`, sous-domaines, données cloisonnées).
2. **Une interface d'administration du contenu** — laisser le salon modifier
   ses prestations, prix et photos sans toucher au code.
3. **Le paiement en ligne** — acompte à la réservation (Stripe, Konnect, Paymee)
   pour réduire les rendez-vous non honorés.
4. **Les notifications sortantes** — SMS/e-mail automatique de confirmation et
   de rappel à la cliente la veille.
5. **L'authentification cliente** — espace personnel avec historique, carte de
   fidélité, programme de parrainage.
6. **Des comptes nominatifs** — une praticienne par identifiant, avec rôles et
   journal des actions.

Ces briques représentent l'essentiel du chemin vers un abonnement mensuel par salon.

### Obligations à respecter avant mise en ligne

- Renseigner des **mentions légales** exactes (matricule fiscal, raison sociale) —
  la structure des pages est prête, seul le contenu est à compléter.
- Déclarer le traitement des données clientes auprès de l'**INPDP** (Tunisie,
  loi n° 2004-63).
- Remplacer `ADMIN_PASSWORD` par un secret long et unique, et activer le HTTPS.
- S'assurer disposer des **droits sur les photographies** utilisées.

---

## 7. Vérifications

```bash
npx next typegen          # génération des types de routes
npm exec tsc -- --noEmit  # vérification TypeScript stricte
npm run build             # build de production
npm run lint              # ESLint
```

---

## 8. Comptes et accès

| Élément | Emplacement |
| --- | --- |
| Espace professionnel | `/admin` |
| Connexion | `/admin/login` |
| Mot de passe | variable d'environnement `ADMIN_PASSWORD` |

Aucun compte cliente n'est nécessaire : la réservation fonctionne sans inscription.
"# beau" 
