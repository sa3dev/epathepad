"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type ForgotPasswordState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

const initialState: ForgotPasswordState = {};

export default function MotDePasseOubliePage() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Vérifiez votre email</h1>
        <p className="text-muted-foreground">
          Si un compte existe avec cette adresse, un lien de réinitialisation vient de lui être
          envoyé. Il est valable une heure.
        </p>
        <Link href="/connexion" className="font-semibold text-primary">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Indiquez votre email, on vous envoie un lien pour en choisir un nouveau.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <FormField label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </FormField>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Envoi…" : "Envoyer le lien"}
        </Button>

        <Link href="/connexion" className="text-sm font-semibold text-primary">
          Retour à la connexion
        </Link>
      </form>
    </div>
  );
}
