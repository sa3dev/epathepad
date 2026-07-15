import { listArtistProfiles } from "@/lib/queries/artist-profiles";
import { ArtistCard } from "@/components/features/directory/artist-card";
import { FilterBar } from "@/components/features/directory/filter-bar";
import type { Discipline } from "@/lib/constants/disciplines";

export default async function ArtistesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string; region?: string }>;
}) {
  const params = await searchParams;
  const artists = await listArtistProfiles({
    discipline: params.discipline as Discipline | undefined,
    region: params.region,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Annuaire des artistes</h1>
        <p className="text-muted-foreground">Trouvez l&apos;animation idéale pour vos résidents.</p>
      </div>

      <FilterBar />

      {artists.length === 0 ? (
        <p className="text-muted-foreground">Aucun artiste ne correspond à ces critères.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}
