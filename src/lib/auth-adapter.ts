import type { Adapter, AdapterUser } from "next-auth/adapters";
import {
  createUser as dbCreateUser,
  getUserByEmail as dbGetUserByEmail,
  getUserById,
  updateUser as dbUpdateUser,
} from "@/lib/queries/users";
import {
  createVerificationToken as dbCreateVerificationToken,
  useVerificationToken as dbUseVerificationToken,
} from "@/lib/queries/verification-tokens";
import type { User } from "@/lib/types";

function toAdapterUser(user: User): AdapterUser {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    name: user.name ?? undefined,
  };
}

// Hand-written Auth.js adapter over raw SQL (no ORM). Only the methods actually
// invoked by the Email/magic-link provider flow are implemented — this app has no
// OAuth providers and uses JWT sessions, so account-linking and DB-session methods
// are never called by Auth.js and are intentionally omitted.
export function RawSqlAdapter(): Adapter {
  return {
    async createUser(user) {
      const created = await dbCreateUser({
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      });
      return toAdapterUser(created);
    },

    async getUser(id) {
      const user = await getUserById(id);
      return user ? toAdapterUser(user) : null;
    },

    async getUserByEmail(email) {
      const user = await dbGetUserByEmail(email);
      return user ? toAdapterUser(user) : null;
    },

    async updateUser(user) {
      const updated = await dbUpdateUser(user.id, {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      });
      return toAdapterUser(updated);
    },

    async createVerificationToken(token) {
      return dbCreateVerificationToken(token);
    },

    async useVerificationToken(params) {
      return dbUseVerificationToken(params);
    },
  };
}
