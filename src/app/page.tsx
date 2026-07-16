import Link from "next/link";
import { auth } from "@/lib/auth";
import { buttonClass } from "@/components/ui/button";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ScrollReveal } from "@/components/scroll-reveal";

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role;
  const spaceHref = role === "EHPAD" ? "/ehpad/artistes" : role === "ARTIST" ? "/artiste/profil" : "/onboarding";

  return (
    <div className="flex flex-1 flex-col">
      <ScrollReveal />

      {/* NAV */}
      <header className="nav border-b border-border">
        <div
          className="wrap"
          style={{ display: "flex", alignItems: "center", width: "100%", gap: "var(--space-4)" }}
        >
          <span className="nav-brand">Épat&apos;Ehpad</span>
          <a href="#pourquoi">Pourquoi</a>
          <a href="#comment">Comment ça marche</a>
          <a href="#artistes">Artistes</a>
          <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            {session?.user ? (
              <>
                <Link href={spaceHref}>Mon espace</Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/connexion">Se connecter</Link>
                <Link href="/inscription" className={buttonClass("secondary")}>
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
      {/* HERO */}
      <section className="marketing-section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 340, height: 340, top: -60, right: -80 }} />
        <div className="wrap flex flex-wrap items-center gap-8">
          <div style={{ flex: "1 1 480px" }}>
            <h1 className="hero-title max-w-xl">Des spectacles joyeux pour vos résidents</h1>
            <p className="hero-sub max-w-lg text-lg">
              Épat&apos;Ehpad met en relation les EHPAD et des artistes indépendants passionnés,
              pour organiser en quelques clics des animations qui font vraiment plaisir aux
              résidents.
            </p>
            <div className="hero-ctas mt-4 flex flex-wrap gap-3">
              <Link href="/inscription?role=EHPAD" className={buttonClass("primary", "lg")}>
                Je suis un EHPAD
              </Link>
              <Link href="/inscription?role=ARTIST" className={buttonClass("secondary", "lg")}>
                Je suis artiste
              </Link>
            </div>
          </div>
          <div style={{ flex: "1 1 320px" }}>
            <div className="stripe washed" style={{ aspectRatio: "4/3", width: "100%" }}>
              photo — spectacle en ehpad
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section id="pourquoi" className="marketing-section">
        <div className="wrap reveal">
          <h2>Pourquoi Épat&apos;Ehpad</h2>
          <div className="reveal-stagger mt-6 flex flex-wrap gap-4">
            <div className="card elev-sm" style={{ flex: "1 1 260px" }}>
              <span className="card-kicker">Confiance</span>
              <h3 className="card-title">Des artistes vérifiés</h3>
              <p className="card-body">Profils complets avec photos, vidéos et discipline.</p>
            </div>
            <div className="card elev-sm" style={{ flex: "1 1 260px" }}>
              <span className="card-kicker">Efficacité</span>
              <h3 className="card-title">Simple et rapide</h3>
              <p className="card-body">Parcourir, contacter, organiser sans intermédiaire.</p>
            </div>
            <div className="card elev-sm" style={{ flex: "1 1 260px" }}>
              <span className="card-kicker">Bienveillance</span>
              <h3 className="card-title">Adapté à vos résidents</h3>
              <p className="card-body">
                Des animations pensées pour le public EHPAD — douceur, joie, lien social.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section
        id="comment"
        className="marketing-section"
        style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", margin: "0 var(--space-6)" }}
      >
        <div className="wrap reveal">
          <h2>Comment ça marche</h2>
          <div className="reveal-stagger mt-6 flex flex-wrap gap-6">
            <div className="step" style={{ flex: "1 1 260px" }}>
              <div className="step-badge">1</div>
              <h4>Créez votre profil</h4>
              <p className="text-muted">EHPAD ou artiste, en quelques minutes.</p>
            </div>
            <div className="step" style={{ flex: "1 1 260px" }}>
              <div className="step-badge">2</div>
              <h4>Parcourez l&apos;annuaire</h4>
              <p className="text-muted">Filtrez par discipline et région.</p>
            </div>
            <div className="step" style={{ flex: "1 1 260px" }}>
              <div className="step-badge">3</div>
              <h4>Envoyez une demande</h4>
              <p className="text-muted">Échangez directement et organisez le spectacle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VOUS ETES ARTISTE */}
      <section id="artistes" className="marketing-section">
        <div className="wrap reveal flex flex-wrap items-center gap-8">
          <div style={{ flex: "1 1 320px" }}>
            <div className="stripe washed" style={{ aspectRatio: "1/1", width: "100%" }}>
              photo — artiste
            </div>
          </div>
          <div style={{ flex: "1 1 420px" }}>
            <span className="tag tag-accent-2">Vous êtes artiste ?</span>
            <h2 className="mt-2">Faites vivre votre spectacle auprès de ceux qui en ont le plus besoin</h2>
            <p className="max-w-lg">
              Créez votre profil, ajoutez vos photos et vidéos, et recevez des demandes d&apos;EHPAD
              de votre région.
            </p>
            <Link href="/inscription?role=ARTIST" className={buttonClass("primary", "md", "mt-3")}>
              Devenir artiste partenaire
            </Link>
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="marketing-section">
        <div className="wrap card elev-sm reveal" style={{ maxWidth: 760, padding: "var(--space-6)" }}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.75"
            style={{ color: "var(--color-accent-700)" }}
          >
            <path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p className="mt-3 text-lg">
            Chaque profil est complété par l&apos;établissement ou l&apos;artiste lui-même — vous
            gardez le contrôle sur qui vous contactez.
          </p>
          <p className="text-muted">À terme : témoignages, nombre d&apos;EHPAD inscrits, etc.</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="marketing-section mb-8"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-bg)",
          borderRadius: "var(--radius-lg)",
          margin: "0 var(--space-6) var(--space-8)",
        }}
      >
        <div className="wrap reveal">
          <h2 style={{ color: "var(--color-bg)" }}>Des spectacles joyeux pour vos résidents</h2>
          <p className="max-w-lg" style={{ opacity: 0.92 }}>
            Épat&apos;Ehpad met en relation les EHPAD et des artistes indépendants passionnés.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/inscription?role=EHPAD"
              className="btn"
              style={{ background: "var(--color-bg)", color: "var(--color-accent-800)" }}
            >
              Je suis un EHPAD
            </Link>
            <Link
              href="/inscription?role=ARTIST"
              className="btn btn-secondary"
              style={{ borderColor: "var(--color-bg)", color: "var(--color-bg)" }}
            >
              Je suis artiste
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="marketing-section" style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-6)" }}>
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <span className="nav-brand" style={{ fontSize: 15 }}>
            Épat&apos;Ehpad
          </span>
          <div className="flex gap-4 text-sm">
            <a href="#">Mentions légales</a>
            <a href="#">Confidentialité</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
