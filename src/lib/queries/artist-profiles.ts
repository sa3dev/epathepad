import { sql } from "@/lib/db";
import type { Discipline } from "@/lib/constants/disciplines";
import type { ArtistProfile } from "@/lib/types";

export async function getArtistProfileByUserId(userId: string): Promise<ArtistProfile | null> {
  const [profile] = await sql<ArtistProfile[]>`
    SELECT * FROM artist_profiles WHERE user_id = ${userId}
  `;
  return profile ?? null;
}

export async function getArtistProfileById(id: string): Promise<ArtistProfile | null> {
  const [profile] = await sql<ArtistProfile[]>`SELECT * FROM artist_profiles WHERE id = ${id}`;
  return profile ?? null;
}

export interface ArtistProfileInput {
  stageName: string;
  bio?: string | null;
  discipline: Discipline;
  regionsServed: string[];
  contactPhone?: string | null;
}

export async function createArtistProfile(
  userId: string,
  data: ArtistProfileInput,
): Promise<ArtistProfile> {
  const [profile] = await sql<ArtistProfile[]>`
    INSERT INTO artist_profiles (user_id, stage_name, bio, discipline, regions_served, contact_phone)
    VALUES (
      ${userId}, ${data.stageName}, ${data.bio ?? null}, ${data.discipline},
      ${sql.array(data.regionsServed)}, ${data.contactPhone ?? null}
    )
    RETURNING *
  `;
  return profile;
}

export async function updateArtistProfile(
  userId: string,
  data: ArtistProfileInput,
): Promise<ArtistProfile> {
  const [profile] = await sql<ArtistProfile[]>`
    UPDATE artist_profiles SET
      stage_name = ${data.stageName},
      bio = ${data.bio ?? null},
      discipline = ${data.discipline},
      regions_served = ${sql.array(data.regionsServed)},
      contact_phone = ${data.contactPhone ?? null},
      updated_at = now()
    WHERE user_id = ${userId}
    RETURNING *
  `;
  return profile;
}

export interface ArtistDirectoryFilters {
  discipline?: Discipline;
  region?: string;
}

export interface ArtistDirectoryEntry extends ArtistProfile {
  coverPhotoUrl: string | null;
}

export async function listArtistProfiles(
  filters: ArtistDirectoryFilters = {},
): Promise<ArtistDirectoryEntry[]> {
  return sql<ArtistDirectoryEntry[]>`
    SELECT
      ap.*,
      (
        SELECT m.url FROM media m
        WHERE m.artist_profile_id = ap.id AND m.type = 'IMAGE'
        ORDER BY m."order" ASC
        LIMIT 1
      ) AS cover_photo_url
    FROM artist_profiles ap
    WHERE
      (${filters.discipline ?? null}::text IS NULL OR ap.discipline = ${filters.discipline ?? null})
      AND (${filters.region ?? null}::text IS NULL OR ap.regions_served @> ARRAY[${filters.region ?? null}]::text[])
    ORDER BY ap.stage_name ASC
  `;
}
