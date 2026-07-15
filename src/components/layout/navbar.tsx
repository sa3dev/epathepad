import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/layout/sign-out-button";

export async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-extrabold text-primary">
          Épat&apos;Ehpad
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-foreground">
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
              <Link
                href="/inscription"
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
