"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ResetPasswordState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

const initialState: ResetPasswordState = {};

export function ResetForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Mot de passe mis à jour</h1>
        <p className="text-muted-foreground">Vous pouvez maintenant vous connecter.</p>
        <Link href="/connexion" className="font-semibold text-primary">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-foreground">Choisir un nouveau mot de passe</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email} />

        <FormField label="Nouveau mot de passe" htmlFor="password">
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
          {isPending ? "Enregistrement…" : "Choisir ce mot de passe"}
        </Button>
      </form>
    </div>
  );
}
