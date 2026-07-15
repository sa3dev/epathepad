import { auth } from "@/lib/auth";
import { getArtistProfileByUserId } from "@/lib/queries/artist-profiles";
import { listRequestsForArtist } from "@/lib/queries/contact-requests";
import { StatusBadge } from "@/components/features/contact-requests/status-badge";
import { Card } from "@/components/ui/card";
import { RespondForm } from "./respond-form";

export default async function ArtistRequestsPage() {
  const session = await auth();
  const profile = await getArtistProfileByUserId(session!.user.id);
  const requests = profile ? await listRequestsForArtist(profile.id) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-foreground">Demandes reçues</h1>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">Vous n&apos;avez pas encore reçu de demande.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((request) => (
            <Card key={request.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">
                  {request.ehpadFacilityName} — {request.ehpadCity}
                </h3>
                <StatusBadge status={request.status} />
              </div>
              <p className="text-sm text-foreground">{request.message}</p>
              {request.status === "PENDING" ? (
                <RespondForm requestId={request.id} />
              ) : (
                <p className="rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                  {request.artistReply
                    ? `Votre réponse : ${request.artistReply}`
                    : request.status === "ACCEPTED"
                      ? "Vous avez accepté cette demande."
                      : "Vous avez décliné cette demande."}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
