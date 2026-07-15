import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";
import { RawSqlAdapter } from "@/lib/auth-adapter";
import { getUserByEmail } from "@/lib/queries/users";
import { sendMagicLinkEmail } from "@/lib/email";
import { credentialsSignInSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: RawSqlAdapter(),
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(rawCredentials) {
        const parsed = credentialsSignInSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await getUserByEmail(parsed.data.email);
        if (!user?.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!passwordsMatch) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
    Nodemailer({
      id: "email",
      name: "Lien magique",
      // Required by the provider's config validation even though it's unused — our
      // sendVerificationRequest below fully replaces the built-in transport.
      server: "smtp://localhost:1025",
      async sendVerificationRequest({ identifier, url }) {
        await sendMagicLinkEmail(identifier, url);
      },
    }),
  ],
});
