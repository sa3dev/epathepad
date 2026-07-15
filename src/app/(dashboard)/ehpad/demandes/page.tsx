import { auth } from "@/lib/auth";
import { getEhpadProfileByUserId } from "@/lib/queries/ehpad-profiles";
import { listRequestsForEhpad } from "@/lib/queries/contact-requests";
import { StatusBadge } from "@/components/features/contact-requests/status-badge";
import { Card } from "@/components/ui/card";

export default async function EhpadRequestsPage() {
  const session = await auth();
  const profile = await getEhpadProfileByUserId(session!.user.id);
  const requests = profile ? await listRequestsForEhpad(profile.id) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-foreground">Mes demandes</h1>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">
          Vous n&apos;avez pas encore envoyé de demande. Parcourez l&apos;annuaire pour trouver un
          artiste.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((request) => (
            <Card key={request.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">{request.artistStageName}</h3>
                <StatusBadge status={request.status} />
              </div>
              <p className="text-sm text-foreground">{request.message}</p>
              {request.artistReply && (
                <p className="rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                  Réponse de l&apos;artiste : {request.artistReply}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
