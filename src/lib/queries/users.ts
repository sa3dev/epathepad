import { sql } from "@/lib/db";
import type { User, UserRole } from "@/lib/types";

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
  return user ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
  return user ?? null;
}

export async function createUser(data: {
  email: string;
  name?: string | null;
  passwordHash?: string | null;
  emailVerified?: Date | null;
}): Promise<User> {
  const [user] = await sql<User[]>`
    INSERT INTO users (email, name, password_hash, email_verified)
    VALUES (${data.email}, ${data.name ?? null}, ${data.passwordHash ?? null}, ${data.emailVerified ?? null})
    RETURNING *
  `;
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, "name" | "email" | "emailVerified" | "role" | "passwordHash">>,
): Promise<User> {
  const [user] = await sql<User[]>`
    UPDATE users
    SET
      name = COALESCE(${data.name ?? null}, name),
      email = COALESCE(${data.email ?? null}, email),
      email_verified = COALESCE(${data.emailVerified ?? null}, email_verified),
      role = COALESCE(${data.role ?? null}, role),
      password_hash = COALESCE(${data.passwordHash ?? null}, password_hash),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return user;
}

export async function setUserRole(id: string, role: UserRole): Promise<User> {
  const [user] = await sql<User[]>`
    UPDATE users SET role = ${role}, updated_at = now() WHERE id = ${id} RETURNING *
  `;
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await sql`DELETE FROM users WHERE id = ${id}`;
}
