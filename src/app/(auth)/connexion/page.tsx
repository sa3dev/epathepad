"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { credentialsSignInAction, magicLinkSignInAction, type SignInState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

const initialState: SignInState = {};

export default function ConnexionPage() {
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [passwordState, passwordAction, passwordPending] = useActionState(
    credentialsSignInAction,
    initialState,
  );
  const [magicLinkState, magicLinkAction, magicLinkPending] = useActionState(
    magicLinkSignInAction,
    initialState,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Connexion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-semibold text-primary">
            Inscrivez-vous
          </Link>
        </p>
      </div>

      <div className="flex gap-2 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={cn(
            "rounded-lg px-3 py-1.5",
            mode === "password" ? "bg-primary/10 text-primary" : "text-muted-foreground",
          )}
        >
          Mot de passe
        </button>
        <button
          type="button"
          onClick={() => setMode("magic-link")}
          className={cn(
            "rounded-lg px-3 py-1.5",
            mode === "magic-link" ? "bg-primary/10 text-primary" : "text-muted-foreground",
          )}
        >
          Lien magique
        </button>
      </div>

      {mode === "password" ? (
        <form action={passwordAction} className="flex flex-col gap-4">
          <FormField label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </FormField>
          <FormField label="Mot de passe" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </FormField>
          {passwordState.error && <p className="text-sm text-destructive">{passwordState.error}</p>}
          <Button type="submit" disabled={passwordPending} className="mt-2">
            {passwordPending ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      ) : (
        <form action={magicLinkAction} className="flex flex-col gap-4">
          <FormField label="Email" htmlFor="magic-email">
            <Input id="magic-email" name="email" type="email" required autoComplete="email" />
          </FormField>
          {magicLinkState.error && <p className="text-sm text-destructive">{magicLinkState.error}</p>}
          <Button type="submit" disabled={magicLinkPending} className="mt-2">
            {magicLinkPending ? "Envoi…" : "Recevoir un lien de connexion"}
          </Button>
        </form>
      )}
    </div>
  );
}
