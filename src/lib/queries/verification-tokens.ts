import { sql } from "@/lib/db";

interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export async function createVerificationToken(data: VerificationToken): Promise<VerificationToken> {
  const [row] = await sql<VerificationToken[]>`
    INSERT INTO verification_tokens (identifier, token, expires)
    VALUES (${data.identifier}, ${data.token}, ${data.expires})
    RETURNING *
  `;
  return row;
}

// Deletes and returns the token in one step ("use once") — returns null if it was
// already used or never existed, which Auth.js treats as an invalid magic link.
export async function useVerificationToken(data: {
  identifier: string;
  token: string;
}): Promise<VerificationToken | null> {
  const [row] = await sql<VerificationToken[]>`
    DELETE FROM verification_tokens
    WHERE identifier = ${data.identifier} AND token = ${data.token}
    RETURNING *
  `;
  return row ?? null;
}
