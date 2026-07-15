import { notFound } from "next/navigation";
import Image from "next/image";
import { getArtistProfileById } from "@/lib/queries/artist-profiles";
import { listMediaForArtist } from "@/lib/queries/media";
import { DISCIPLINE_LABELS } from "@/lib/constants/disciplines";
import { Badge } from "@/components/ui/badge";
import { ContactRequestForm } from "./contact-request-form";

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = await getArtistProfileById(id);
  if (!artist) notFound();

  const media = await listMediaForArtist(artist.id);
  const photos = media.filter((item) => item.type === "IMAGE");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">{artist.stageName}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge>{DISCIPLINE_LABELS[artist.discipline]}</Badge>
          <span className="text-sm text-muted-foreground">{artist.regionsServed.join(", ")}</span>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={photo.url} alt={artist.stageName} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}

      {artist.bio && <p className="max-w-2xl text-foreground">{artist.bio}</p>}

      <div className="max-w-lg rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Envoyer une demande de contact</h2>
        <ContactRequestForm artistProfileId={artist.id} />
      </div>
    </div>
  );
}
