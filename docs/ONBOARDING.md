# Onboarding d'un nouveau salon — mode d'emploi

> Modèle : **un déploiement = un client**. Chaque salon possède ses comptes,
> paie son hébergement, et vous facture l'installation + la maintenance.

Durée totale : **60 à 90 minutes** par salon (dont ~20 min avec la cliente).

---

## 0. Ce qu'il faut avant de commencer

| Élément | Qui le fournit |
|---|---|
| Adresse Gmail du salon (ou créer `lesalon.tunis@gmail.com`) | Le salon |
| Nom, téléphone, WhatsApp, adresse, ville, réseaux sociaux | Le salon |
| Catalogue : prestations, prix en TND, durées | Le salon (photo du menu papier suffit) |
| 8–15 photos (salon, réalisations) | Le salon (smartphone OK) |
| Nom de domaine souhaité (idéalement `.tn`) | Vous conseillez, le salon paie |

---

## 1. Comptes du CLIENT (15 min, en visio avec la cliente)

Tout est gratuit au démarrage. La cliente crée les comptes elle-même
(récupération possible si elle vous quitte — argument de vente) :

1. **Neon** (base PostgreSQL) — https://neon.com
   → Sign up with Google → Create project (`salon-xxx`, région EU)
   → copier la **Connection string (pooled)**.
2. **Vercel** (hébergement) — https://vercel.com
   → Sign up with Google (même adresse).
3. **GitHub** (code) — https://github.com — si pas déjà.
4. **Resend** (e-mails, optionnel) — https://resend.com — si alertes mail voulues.

> Demandez un accès temporaire à ses comptes Vercel + Neon le temps
> de l'installation, puis faites-lui changer les mots de passe à la remise.

---

## 2. Configurer le projet (10 min, vous)

```bash
git clone <votre-repo-template> salon-xxx && cd salon-xxx
npm install
npm run new-client        # répond aux questions → génère .env.local
```

Puis créez les tables sur la base Neon **du client** :

```bash
DATABASE_URL="<connection-string-neon>" npm run db:push
```

Vérifiez en local :

```bash
npm run dev   # → http://localhost:3000  (+ /admin avec le mot de passe généré)
```

---

## 3. Personnaliser le contenu (20–30 min, vous)

| Fichier | Quoi |
|---|---|
| `src/lib/services.ts` | Remplacer le catalogue (noms, prix TND, durées, catégories) |
| `public/images/` | Remplacer les photos (mêmes noms de fichiers = zéro code) |
| `src/components/Testimonials.tsx` | Vrais avis du salon (ou masquer la section) |
| `src/components/Bridal.tsx` | Adapter le devis cité + la formule mariée |
| `src/app/globals.css` (`@theme`) | Palette du salon (optionnel, facturable) |
| `src/lib/legal.ts` | Matricule fiscal, raison sociale exacte |

Insérez ensuite le jeu de démo pour présenter un back-office vivant :

```bash
DATABASE_URL="<connection-string-neon>" npm run seed:demo
```

---

## 4. Déployer sur le compte Vercel DU CLIENT (15 min, vous)

1. Poussez le code sur un dépôt GitHub privé **`salon-xxx`** (propriété : vous,
   cliente ajoutée en collaboratrice — ou l'inverse selon votre contrat).
2. Sur le compte Vercel **de la cliente** : Add New → Project → Import `salon-xxx`.
3. Environment Variables : copiez **tout** le contenu de `.env.local`
   (la commande `new-client` l'a affiché — `DATABASE_URL`, `ADMIN_PASSWORD`,
   tous les `NEXT_PUBLIC_*`).
4. Deploy. Vérifiez : page d'accueil, réservation test, `/admin`, `/api/health`.
5. Domaine : Settings → Domains → ajouter `www.lesalon.tn`
   (domaine `.tn` commandé chez ATI/OVH par la cliente, ~35–60 TND/an).
   Mettez à jour `NEXT_PUBLIC_SITE_URL` avec le vrai domaine et redeployez.

---

## 5. Remise à la cliente (20 min, en présentiel de préférence)

- [ ] `DATABASE_URL="..." npm run seed:clear` — base de démo vidée
- [ ] Réservation test réelle + annulation depuis le site
- [ ] Tour de l'espace pro : confirmer, rappel WhatsApp 1-clic, fiche du jour, CSV
- [ ] Réglages : postes simultanés, horaires, jour de fermeture, e-mail d'alerte
- [ ] Remettre la fiche : URL du site, `/admin`, mot de passe, vos coordonnées support
- [ ] Faire changer les mots de passe Neon/Vercel (révoquer votre accès)
- [ ] Proposer le contrat de maintenance (voir README, section 6)

---

## 6. Après-vente (facturé ou inclus selon contrat)

| Demande | Action |
|---|---|
| Changer un prix / une prestation | Modifier `services.ts` → `git push` (Vercel redeploie seul) |
| Changer un texte / une photo | Idem |
| Changer le mot de passe admin | Vercel → Env `ADMIN_PASSWORD` → Redeploy |
| Changer les horaires | La cliente le fait elle-même dans /admin → Réglages |
| Site en panne | `/api/health` + Vercel → Deployments → Rollback en 1 clic |
| Sauvegarde | Neon → Backups (automatique) — voir docs/HOSTING.md |
