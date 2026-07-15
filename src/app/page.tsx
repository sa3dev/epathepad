import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl">
        Des spectacles joyeux pour vos résidents
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Épat&apos;Ehpad met en relation les EHPAD et les artistes indépendants pour organiser
        facilement des animations et des spectacles chaleureux.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/inscription" className={cn(buttonVariants({ size: "lg" }))}>
          Créer un compte
        </Link>
        <Link href="/connexion" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Se connecter
        </Link>
      </div>
    </div>
  );
}
