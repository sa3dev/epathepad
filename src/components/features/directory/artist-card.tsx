import Link from "next/link";
import Image from "next/image";
import { DISCIPLINE_LABELS } from "@/lib/constants/disciplines";
import { Badge } from "@/components/ui/badge";
import type { ArtistDirectoryEntry } from "@/lib/queries/artist-profiles";

export function ArtistCard({ artist }: { artist: ArtistDirectoryEntry }) {
  return (
    <Link
      href={`/ehpad/artistes/${artist.id}`}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card elev-sm transition-transform hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-video bg-[var(--color-accent-100)]">
        {artist.coverPhotoUrl && (
          <Image
            src={artist.coverPhotoUrl}
            alt={artist.stageName}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-bold text-foreground">{artist.stageName}</h3>
        <Badge>{DISCIPLINE_LABELS[artist.discipline]}</Badge>
        <p className="text-sm text-muted-foreground">{artist.regionsServed.join(", ")}</p>
      </div>
    </Link>
  );
}
