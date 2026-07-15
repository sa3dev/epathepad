import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/types";

declare module "next-auth" {
  interface User {
    role?: UserRole | null;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole | null;
  }
}
