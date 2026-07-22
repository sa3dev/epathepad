import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      <p>Épat&apos;Ehpad — mise en relation entre EHPAD et artistes</p>
      <div className="mt-2 flex justify-center gap-4">
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/cgu">CGU</Link>
        <Link href="/confidentialite">Confidentialité</Link>
      </div>
    </footer>
  );
}
