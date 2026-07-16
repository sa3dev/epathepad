import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { buttonClass } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="nav border-b border-border">
      <div className="wrap" style={{ display: "flex", alignItems: "center", width: "100%", gap: "var(--space-4)" }}>
        <Link href="/" className="nav-brand">
          Épat&apos;Ehpad
        </Link>
        <nav className="flex items-center gap-5">
          {role === "EHPAD" && (
            <>
              <Link href="/ehpad/artistes">Annuaire</Link>
              <Link href="/ehpad/demandes">Mes demandes</Link>
              <Link href="/ehpad/profil">Mon profil</Link>
            </>
          )}
          {role === "ARTIST" && (
            <>
              <Link href="/artiste/demandes">Demandes reçues</Link>
              <Link href="/artiste/profil">Mon profil</Link>
            </>
          )}
          {session?.user ? (
            <SignOutButton />
          ) : (
            <>
              <Link href="/connexion">Connexion</Link>
              <Link href="/inscription" className={buttonClass("primary", "sm")}>
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
