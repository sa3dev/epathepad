export const metadata = { title: "Politique de confidentialité — Épat'Ehpad" };

export default function ConfidentialitePage() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p className="text-muted">Dernière mise à jour : [DATE À COMPLÉTER]</p>

      <h2>Responsable de traitement</h2>
      <p>
        [NOM ET PRÉNOM], entrepreneur individuel, éditeur du site Épat&apos;Ehpad (voir les{" "}
        <a href="/mentions-legales">mentions légales</a>), est responsable du traitement des
        données décrites ci-dessous. Pour toute question ou pour exercer vos droits, contactez
        [EMAIL DE CONTACT À COMPLÉTER].
      </p>

      <h2>Données collectées</h2>
      <p>
        Selon votre profil, Épat&apos;Ehpad collecte : votre nom, votre adresse email et votre mot
        de passe (stocké de façon chiffrée, jamais en clair) ; pour un EHPAD : nom et adresse de
        l&apos;établissement, région, description, coordonnées de contact ; pour un artiste : nom
        de scène, biographie, discipline, régions desservies, coordonnées de contact, ainsi que les
        photos et vidéos que vous choisissez d&apos;ajouter à votre profil ; et le contenu des
        demandes de contact échangées entre un EHPAD et un artiste.
      </p>

      <h2>Finalités</h2>
      <p>
        Ces données sont utilisées pour créer et gérer votre compte, afficher votre profil dans
        l&apos;annuaire (le cas échéant), et permettre la mise en relation entre EHPAD et artistes.
        Elles ne sont pas utilisées à des fins de prospection commerciale ni cédées à des tiers.
      </p>

      <h2>Base légale</h2>
      <p>
        Le traitement repose sur l&apos;exécution du contrat qui vous lie à Épat&apos;Ehpad
        (création et fonctionnement de votre compte) et, pour les photos/vidéos que vous publiez,
        sur votre consentement exprès au moment de leur ajout.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Vos données sont conservées tant que votre compte est actif. En cas de suppression de
        compte, elles sont effacées dans un délai raisonnable, sauf obligation légale de
        conservation plus longue.
      </p>

      <h2>Destinataires</h2>
      <p>
        Vos données ne sont accessibles qu&apos;à Épat&apos;Ehpad et à ses prestataires
        techniques strictement nécessaires au fonctionnement du service : l&apos;hébergeur du site
        (Hetzner Online GmbH) et, si vous ajoutez des photos/vidéos, le service de stockage utilisé
        pour les héberger.
      </p>

      <h2>Cookies</h2>
      <p>
        Épat&apos;Ehpad utilise uniquement un cookie de session strictement nécessaire pour vous
        maintenir connecté(e) à votre compte. Aucun cookie de mesure d&apos;audience ou publicitaire
        n&apos;est utilisé à ce jour.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, d&apos;opposition et de portabilité sur vos données. Vous pouvez exercer
        ces droits en écrivant à [EMAIL DE CONTACT À COMPLÉTER], ou directement en modifiant votre
        profil depuis votre compte. Vous disposez également du droit d&apos;introduire une
        réclamation auprès de la CNIL (cnil.fr).
      </p>

      <h2>Sécurité</h2>
      <p>
        Les mots de passe sont stockés sous forme hachée (bcrypt) et ne sont jamais accessibles en
        clair, y compris par Épat&apos;Ehpad elle-même.
      </p>

      <p className="text-muted">
        Document rédigé à titre de base de travail — à faire relire par un professionnel du droit
        avant mise en ligne publique.
      </p>
    </>
  );
}
