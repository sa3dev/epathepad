import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe: only route-protection UX (redirects). The real authorization
// boundary is re-checked server-side in each page/server action — see auth.config.ts.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
