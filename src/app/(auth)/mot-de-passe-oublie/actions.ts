"use server";

import { randomBytes } from "node:crypto";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { getUserByEmail } from "@/lib/queries/users";
import { createPasswordResetToken } from "@/lib/queries/password-reset-tokens";
import { sendPasswordResetEmail } from "@/lib/email";

export interface ForgotPasswordState {
  error?: string;
  success?: boolean;
}

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Adresse email invalide" };
  }

  const user = await getUserByEmail(parsed.data.email);

  // Only send an email if the account exists, but always return the same
  // success response either way — otherwise this endpoint could be used to
  // check which emails have an account.
  if (user) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + TOKEN_TTL_MS);
    await createPasswordResetToken({ identifier: user.email, token, expires });

    const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
    const url = `${baseUrl}/reinitialiser-mot-de-passe?token=${token}&email=${encodeURIComponent(user.email)}`;
    await sendPasswordResetEmail(user.email, url);
  }

  return { success: true };
}
