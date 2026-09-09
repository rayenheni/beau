# Hébergement — un déploiement = un client

> Principe : **le salon paie et possède son hébergement**.
> Vous n'êtes jamais l'intermédiaire financier ni le point de défaillance unique.

---

## 1. Architecture par client

```
  Cliente ──►  Vercel (site Next.js) ──► Neon (PostgreSQL)
  salon-xxx.vercel.app / www.salon.tn      projet salon-xxx
  compte Vercel DU SALON                   compte Neon DU SALON
```

| Brique | Fournisseur | Compte | Coût au démarrage |
|---|---|---|---|
| Site web + HTTPS + CDN | Vercel (Hobby) | Le salon | **0 $** |
| Base PostgreSQL 0,5 Go | Neon (Free) | Le salon | **0 $** |
| Domaine `.tn` | ATI / OVH / registrars | Le salon | **~35–60 TND/an** |
| E-mails d'alerte (optionnel) | Resend (Free, 100/j) | Le salon | **0 $** |
| Surveillance | UptimeRobot (Free) | Vous | **0 $** |

**Coût total pour le salon : ~0 TND/mois + domaine.** Quand le salon grandit
(trafic élevé, base > 0,5 Go), c'est lui qui passe aux offres payantes
(Vercel Pro ~20 $/mois, Neon Scale) — jamais vous.

---

## 2. Pourquoi ce découpage (argumentaire commercial)

- **Le salon est propriétaire** : s'il arrête la maintenance, son site
  continue de tourner et ses données restent chez lui. Zéro otage.
- **Isolation totale** : la panne ou le piratage d'un salon n'affecte
  jamais les autres. Chaque base est séparée, chaque mot de passe unique.
- **Marges saines pour vous** : aucun coût d'infrastructure qui grignote
  l'abonnement de maintenance. Votre temps est votre seul coût.

---

## 3. Sauvegardes

- **Neon** : sauvegardes automatiques + restauration point-in-time
  (fenêtre selon l'offre en vigueur — vérifier au moment de l'installation).
- **Avant toute opération risquée** (grosse mise à jour) :
  ```bash
  pg_dump "<DATABASE_URL>" > backup-salon-xxx-$(date +%F).sql
  ```
- **Restauration** : Neon → Restore, ou `psql "<DATABASE_URL>" < backup.sql`.
- Recommandez à la cliente l'**export CSV mensuel** depuis /admin
  (bouton intégré) : simple, gratuit, et elle « voit » ses données.

---

## 4. Surveillance (votre côté, gratuit)

Par client, 5 minutes de setup :

1. **UptimeRobot** (gratuit, 50 monitors) : ping `https://www.salon.tn/api/health`
   toutes les 5 min → alerte e-mail/SMS si le site tombe.
2. **Vercel** : gardez un accès « Viewer » au projet (avec l'accord de la
   cliente) pour voir les déploiements et les logs en cas de panne.
3. **Neon** : vérifiez le % de stockage utilisé à chaque visite de maintenance.

---

## 5. Sécurité — checklist par déploiement

- [ ] `ADMIN_PASSWORD` long et unique (généré par `npm run new-client`)
- [ ] Comptes Vercel/Neon au nom du salon, mots de passe changés à la remise
- [ ] HTTPS forcé (automatique sur Vercel, vérifier le cadenas)
- [ ] Domaine `.tn` + `NEXT_PUBLIC_SITE_URL` à jour (sinon SEO cassé)
- [ ] Base de démo vidée (`npm run seed:clear`) avant la remise
- [ ] Mentions légales : matricule fiscal et raison sociale réels
- [ ] Photos : droits vérifiés (photos du salon = OK)

---

## 6. Si le salon arrête la maintenance

1. Révoquez vos accès (Vercel, Neon, GitHub, UptimeRobot).
2. Remettez un document : liste des comptes, où cliquer pour quoi,
   contact d'un remplaçant éventuel.
3. Le site continue de fonctionner sans vous — c'est prévu, pas un bug.
   (C'est aussi pour ça que l'installation se paie au forfait : vous êtes
   déjà rentable le jour de la remise.)
