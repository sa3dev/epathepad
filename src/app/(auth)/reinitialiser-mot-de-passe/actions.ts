"use server";

import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { getUserByEmail, updateUser } from "@/lib/queries/users";
import { usePasswordResetToken as consumePasswordResetToken } from "@/lib/queries/password-reset-tokens";

export interface ResetPasswordState {
  error?: string;
  success?: boolean;
}

const INVALID_OR_EXPIRED = "Ce lien de réinitialisation est invalide ou a expiré.";

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const tokenRow = await consumePasswordResetToken({
    identifier: parsed.data.email,
    token: parsed.data.token,
  });
  if (!tokenRow || tokenRow.expires.getTime() < Date.now()) {
    return { error: INVALID_OR_EXPIRED };
  }

  const user = await getUserByEmail(parsed.data.email);
  if (!user) {
    return { error: INVALID_OR_EXPIRED };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await updateUser(user.id, { passwordHash });

  return { success: true };
}
