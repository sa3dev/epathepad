# Déploiement — Épat'Ehpad

## Où en est le projet

Le MVP minimal (inscription EHPAD/artiste, profils, annuaire, demandes de contact, pages
légales, réinitialisation de mot de passe, emails via Resend, rate limiting) est terminé et
poussé sur GitHub (`sa3dev/epathepad`, branche `main`). Il ne reste plus qu'à déployer sur le
VPS Dokploy pour pouvoir commencer à prospecter.

Les mentions légales contiennent encore des `[À COMPLÉTER]` (nom, SIRET, adresse, email de
contact) — décision assumée de les remplir après la mise en ligne, pas un blocage technique.

## Étapes de déploiement sur Dokploy

1. **Créer l'app** : dans Dokploy → *Create Application* → source = **Git Provider** →
   `git@github.com:sa3dev/epathepad.git` (ou l'URL HTTPS) → branche `main`.
2. **Build** : type = **Dockerfile** (déjà à la racine du repo). Port de l'application = **3000**.
3. **Base de données** : *Create Database* → Postgres, dans le même projet Dokploy. Noter
   l'URL de connexion interne fournie.
4. **Variables d'environnement** (onglet Environment de l'app) :
   ```
   DATABASE_URL=<URL Postgres de l'étape 3>
   AUTH_SECRET=2mjVSo5p1ebVQJvgFwGLQkUKmAN08L420xYeNn2trJ4=
   AUTH_URL=<URL attribuée par Dokploy, onglet Domains>
   RESEND_API_KEY=<clé API Resend>
   EMAIL_FROM=Épat'Ehpad <onboarding@resend.dev>
   ```
   (`S3_*` restent vides pour l'instant — upload photo/vidéo pas encore activé, échoue
   proprement sans planter le reste du site.)
5. **Domaine** : onglet *Domains* → activer le sous-domaine proposé par Dokploy (ou un domaine
   personnel). Reporter l'URL exacte dans `AUTH_URL` à l'étape 4 si elle change.
6. **Pre-deploy command** : `node dist/migrate.js` (applique les migrations avant chaque
   redéploiement).
7. **Deploy**, puis vérifier que `<url>/api/health` répond `{"status":"ok"}`.

## Après le premier déploiement réussi

- Remplir les vraies infos dans les pages légales (`src/app/(legal)/mentions-legales/page.tsx`
  et `confidentialite/page.tsx`) : nom, SIRET, adresse, email de contact.
- Configurer Cloudflare R2 si l'upload de photos/vidéos devient nécessaire (voir `.env.example`
  pour les variables `S3_*`).
- Sauvegarde ponctuelle de la base (`pg_dump`) avant de commencer à recruter de vrais
  utilisateurs.

## Reporté après validation de la traction

Vérification des artistes, notifications email sur les demandes, back-office admin,
analytics, paiement/commission — voir `docs/business-model.md` pour le contexte business.
