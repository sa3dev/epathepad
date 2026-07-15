import { sql } from "@/lib/db";
import type { Media, MediaType } from "@/lib/types";

export async function listMediaForArtist(artistProfileId: string): Promise<Media[]> {
  return sql<Media[]>`
    SELECT * FROM media WHERE artist_profile_id = ${artistProfileId} ORDER BY "order" ASC
  `;
}

export async function addMedia(data: {
  artistProfileId: string;
  url: string;
  type: MediaType;
  order?: number;
}): Promise<Media> {
  const [media] = await sql<Media[]>`
    INSERT INTO media (artist_profile_id, url, type, "order")
    VALUES (${data.artistProfileId}, ${data.url}, ${data.type}, ${data.order ?? 0})
    RETURNING *
  `;
  return media;
}

// Scoped to artistProfileId so an artist can only delete their own media.
export async function deleteMedia(id: string, artistProfileId: string): Promise<void> {
  await sql`DELETE FROM media WHERE id = ${id} AND artist_profile_id = ${artistProfileId}`;
}
