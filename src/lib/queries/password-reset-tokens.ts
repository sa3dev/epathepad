import { sql } from "@/lib/db";

interface PasswordResetToken {
  identifier: string;
  token: string;
  expires: Date;
}

export async function createPasswordResetToken(data: PasswordResetToken): Promise<PasswordResetToken> {
  const [row] = await sql<PasswordResetToken[]>`
    INSERT INTO password_reset_tokens (identifier, token, expires)
    VALUES (${data.identifier}, ${data.token}, ${data.expires})
    RETURNING *
  `;
  return row;
}

// Deletes and returns the token in one step ("use once") — returns null if it was
// already used, expired-and-cleaned-up, or never existed.
export async function usePasswordResetToken(data: {
  identifier: string;
  token: string;
}): Promise<PasswordResetToken | null> {
  const [row] = await sql<PasswordResetToken[]>`
    DELETE FROM password_reset_tokens
    WHERE identifier = ${data.identifier} AND token = ${data.token}
    RETURNING *
  `;
  return row ?? null;
}
