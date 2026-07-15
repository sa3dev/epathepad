"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

const initialState: RegisterState = {};

export default function InscriptionPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const [role, setRole] = useState<"EHPAD" | "ARTIST">("EHPAD");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Créer un compte</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="font-semibold text-primary">
            Connectez-vous
          </Link>
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="role" value={role} />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("EHPAD")}
            className={cn(
              "rounded-lg border px-4 py-3 text-sm font-semibold transition-colors",
              role === "EHPAD"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground",
            )}
          >
            Je suis un EHPAD
          </button>
          <button
            type="button"
            onClick={() => setRole("ARTIST")}
            className={cn(
              "rounded-lg border px-4 py-3 text-sm font-semibold transition-colors",
              role === "ARTIST"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground",
            )}
          >
            Je suis artiste
          </button>
        </div>

        <FormField label="Nom" htmlFor="name">
          <Input id="name" name="name" required autoComplete="name" />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </FormField>

        <FormField label="Mot de passe" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </FormField>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Création…" : "Créer mon compte"}
        </Button>
      </form>
    </div>
  );
}
