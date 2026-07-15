import type { NextAuthConfig } from "next-auth";

// Edge-safe config used by middleware.ts — no database access, no Node-only
// dependencies (bcrypt, postgres driver) here. The full provider list with DB
// access lives in auth.ts and is only used in the Node.js runtime (API routes,
// server components/actions).
export const authConfig: NextAuthConfig = {
  // Required behind a reverse proxy (Dokploy/Traefik) so Auth.js trusts the
  // forwarded host/proto headers instead of only the configured AUTH_URL.
  trustHost: true,
  pages: {
    signIn: "/connexion",
    newUser: "/onboarding",
    verifyRequest: "/verifier",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      const isOnDashboard = pathname.startsWith("/ehpad") || pathname.startsWith("/artiste");
      const isOnOnboarding = pathname.startsWith("/onboarding");
      const isOnAuthPages = pathname.startsWith("/connexion") || pathname.startsWith("/inscription");

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        if (!role) return Response.redirect(new URL("/onboarding", nextUrl));
        return true;
      }

      if (isOnOnboarding) {
        return isLoggedIn;
      }

      if (isOnAuthPages && isLoggedIn && role) {
        const home = role === "EHPAD" ? "/ehpad/artistes" : "/artiste/profil";
        return Response.redirect(new URL(home, nextUrl));
      }

      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // Triggered by the client calling useSession().update({ user: { role } }) right
      // after onboarding sets the role in the DB — refreshes the JWT without a full re-login.
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "EHPAD" | "ARTIST" | null;
      }
      return session;
    },
  },
};
