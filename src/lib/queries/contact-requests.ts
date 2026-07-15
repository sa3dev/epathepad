import { sql } from "@/lib/db";
import type { ContactRequest, ContactRequestStatus } from "@/lib/types";

export async function createContactRequest(data: {
  ehpadProfileId: string;
  artistProfileId: string;
  message: string;
}): Promise<ContactRequest> {
  const [request] = await sql<ContactRequest[]>`
    INSERT INTO contact_requests (ehpad_profile_id, artist_profile_id, message)
    VALUES (${data.ehpadProfileId}, ${data.artistProfileId}, ${data.message})
    RETURNING *
  `;
  return request;
}

export interface ContactRequestWithArtist extends ContactRequest {
  artistStageName: string;
}

export async function listRequestsForEhpad(ehpadProfileId: string): Promise<ContactRequestWithArtist[]> {
  return sql<ContactRequestWithArtist[]>`
    SELECT cr.*, ap.stage_name AS artist_stage_name
    FROM contact_requests cr
    JOIN artist_profiles ap ON ap.id = cr.artist_profile_id
    WHERE cr.ehpad_profile_id = ${ehpadProfileId}
    ORDER BY cr.created_at DESC
  `;
}

export interface ContactRequestWithEhpad extends ContactRequest {
  ehpadFacilityName: string;
  ehpadCity: string;
}

export async function listRequestsForArtist(artistProfileId: string): Promise<ContactRequestWithEhpad[]> {
  return sql<ContactRequestWithEhpad[]>`
    SELECT cr.*, ep.facility_name AS ehpad_facility_name, ep.city AS ehpad_city
    FROM contact_requests cr
    JOIN ehpad_profiles ep ON ep.id = cr.ehpad_profile_id
    WHERE cr.artist_profile_id = ${artistProfileId}
    ORDER BY cr.created_at DESC
  `;
}

// Scoped to artistProfileId so only the targeted artist can respond to a request.
export async function respondToContactRequest(data: {
  id: string;
  artistProfileId: string;
  status: Extract<ContactRequestStatus, "ACCEPTED" | "DECLINED">;
  artistReply?: string | null;
}): Promise<ContactRequest | null> {
  const [request] = await sql<ContactRequest[]>`
    UPDATE contact_requests SET
      status = ${data.status},
      artist_reply = ${data.artistReply ?? null},
      responded_at = now()
    WHERE id = ${data.id} AND artist_profile_id = ${data.artistProfileId}
    RETURNING *
  `;
  return request ?? null;
}
