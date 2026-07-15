import { sql } from "@/lib/db";
import type { EhpadProfile } from "@/lib/types";

export async function getEhpadProfileByUserId(userId: string): Promise<EhpadProfile | null> {
  const [profile] = await sql<EhpadProfile[]>`
    SELECT * FROM ehpad_profiles WHERE user_id = ${userId}
  `;
  return profile ?? null;
}

export async function getEhpadProfileById(id: string): Promise<EhpadProfile | null> {
  const [profile] = await sql<EhpadProfile[]>`SELECT * FROM ehpad_profiles WHERE id = ${id}`;
  return profile ?? null;
}

export interface EhpadProfileInput {
  facilityName: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
  description?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
}

export async function createEhpadProfile(
  userId: string,
  data: EhpadProfileInput,
): Promise<EhpadProfile> {
  const [profile] = await sql<EhpadProfile[]>`
    INSERT INTO ehpad_profiles (
      user_id, facility_name, address, city, postal_code, region, description, contact_phone, contact_email
    ) VALUES (
      ${userId}, ${data.facilityName}, ${data.address}, ${data.city}, ${data.postalCode},
      ${data.region}, ${data.description ?? null}, ${data.contactPhone ?? null}, ${data.contactEmail ?? null}
    )
    RETURNING *
  `;
  return profile;
}

export async function updateEhpadProfile(
  userId: string,
  data: EhpadProfileInput,
): Promise<EhpadProfile> {
  const [profile] = await sql<EhpadProfile[]>`
    UPDATE ehpad_profiles SET
      facility_name = ${data.facilityName},
      address = ${data.address},
      city = ${data.city},
      postal_code = ${data.postalCode},
      region = ${data.region},
      description = ${data.description ?? null},
      contact_phone = ${data.contactPhone ?? null},
      contact_email = ${data.contactEmail ?? null},
      updated_at = now()
    WHERE user_id = ${userId}
    RETURNING *
  `;
  return profile;
}
