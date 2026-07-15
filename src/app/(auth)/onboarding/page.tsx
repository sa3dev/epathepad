"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { setRoleAction } from "./actions";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const { update } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState<"EHPAD" | "ARTIST" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function choose(role: "EHPAD" | "ARTIST") {
    setPending(role);
    setError(null);

    const result = await setRoleAction(role);
    if (result.error) {
      setError(result.error);
      setPending(null);
      return;
    }

    await update({ user: { role } });
    router.push(role === "EHPAD" ? "/ehpad/profil" : "/artiste/profil");
  }

  return (
    <div className="flex flex-col gap-6 text-center">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Bienvenue !</h1>
        <p className="mt-1 text-muted-foreground">Vous êtes…</p>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => choose("EHPAD")}
          className={cn(
            "rounded-lg border border-border px-4 py-4 text-left font-semibold hover:bg-accent",
            pending === "EHPAD" && "opacity-60",
          )}
        >
          Un EHPAD à la recherche d&apos;animations
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => choose("ARTIST")}
          className={cn(
            "rounded-lg border border-border px-4 py-4 text-left font-semibold hover:bg-accent",
            pending === "ARTIST" && "opacity-60",
          )}
        >
          Un artiste proposant des spectacles
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
