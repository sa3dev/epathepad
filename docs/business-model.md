# Business model — Épat'Ehpad

## Contexte

Épat'Ehpad est une marketplace à deux faces : les EHPAD (demande) cherchent des animations/spectacles pour leurs résidents, les artistes/intermittents (offre) cherchent des dates. Comme toute marketplace bicéphale, la difficulté est d'amorcer les deux côtés en même temps — et de choisir quel côté monétiser sans casser la liquidité.

## Modèle retenu : abonnement B2B côté EHPAD, gratuit côté artiste

- **EHPAD** : abonnement mensuel/annuel par établissement (ordre de grandeur ~30–50 €/mois) donnant accès à l'annuaire complet et aux demandes de contact illimitées.
- **Artistes** : profil et mise en relation gratuits, sans limite de demandes reçues.

### Pourquoi ce sens-là et pas l'inverse

- Les EHPAD ont un budget "animation" identifié dans leur fonctionnement — poste de dépense déjà existant, facile à rattacher une facture SaaS classique.
- Les artistes indépendants/intermittents ont des revenus irréguliers et une capacité à payer plus faible ; les faire payer freinerait l'inscription et donc l'offre disponible, ce qui est le point le plus fragile d'une marketplace au lancement.
- Stratégie classique de marketplace bicéphale : subventionner (gratuité) le côté le plus dur à recruter pour maximiser l'offre, monétiser le côté institutionnel qui peut payer et pour qui la valeur perçue est la plus directe (accès à un vivier d'artistes vérifiés).

### Compromis assumé

- On laisse de la valeur sur la table sur les prestations à forte valeur (pas de commission sur les cachets).
- Pas besoin d'intégrer un paiement/séquestre (Stripe Connect etc.) dès le lancement — la plateforme reste une mise en relation, pas un flux financier entre les deux parties. Simplifie fortement le MVP technique et juridique (pas de statut d'intermédiaire de paiement à gérer).

## Options envisagées mais non retenues pour le lancement

| Modèle | Description | Pourquoi pas maintenant |
|---|---|---|
| Commission à la prestation | % prélevé sur chaque cachet une fois la prestation conclue | Nécessite paiement intégré (Stripe Connect, séquestre, litiges) — complexité hors scope du MVP |
| Freemium artiste (mise en avant payante) | Profil gratuit, mais visibilité boostée payante dans l'annuaire | Pertinent seulement une fois qu'il y a assez d'artistes pour qu'un classement ait un sens |
| Frais à la demande de contact | EHPAD ou artiste paie par mise en relation envoyée/reçue | Frein à l'usage justement au moment où il faut prouver la valeur de la plateforme |

## Évolutions possibles (v2+)

- Ajouter une commission optionnelle une fois le paiement intégré, en complément de l'abonnement (double monétisation), si le volume de prestations conclues devient significatif.
- Mise en avant payante pour les artistes une fois l'annuaire suffisamment fourni pour qu'un classement soit pertinent.
- Grille tarifaire EHPAD différenciée par taille d'établissement (nombre de résidents) plutôt qu'un tarif unique.

## À trancher plus tard

- Prix exact de l'abonnement EHPAD et existence d'un palier d'essai gratuit (ex. 30 jours).
- Modalités de facturation (mensuelle vs annuelle avec remise).
- Seuil à partir duquel introduire une commission sans décourager l'usage.
