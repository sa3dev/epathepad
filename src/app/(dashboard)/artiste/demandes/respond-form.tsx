"use client";

import { useState } from "react";
import { respondToRequestAction } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function RespondForm({ requestId }: { requestId: string }) {
  const [reply, setReply] = useState("");
  const [pending, setPending] = useState<"ACCEPTED" | "DECLINED" | null>(null);
  const [done, setDone] = useState(false);

  async function respond(status: "ACCEPTED" | "DECLINED") {
    setPending(status);
    await respondToRequestAction({ requestId, status, artistReply: reply || undefined });
    setPending(null);
    setDone(true);
  }

  if (done) return <p className="text-sm text-secondary-foreground">Réponse envoyée.</p>;

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        placeholder="Message de réponse (optionnel)"
        value={reply}
        onChange={(event) => setReply(event.target.value)}
        rows={2}
      />
      <div className="flex gap-2">
        <Button size="sm" disabled={pending !== null} onClick={() => respond("ACCEPTED")}>
          {pending === "ACCEPTED" ? "…" : "Accepter"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending !== null}
          onClick={() => respond("DECLINED")}
        >
          {pending === "DECLINED" ? "…" : "Décliner"}
        </Button>
      </div>
    </div>
  );
}
