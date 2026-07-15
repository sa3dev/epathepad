"use server";

import { auth } from "@/lib/auth";
import { setUserRole } from "@/lib/queries/users";
import { onboardingSchema } from "@/lib/validations/auth";

export async function setRoleAction(role: "EHPAD" | "ARTIST"): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Non authentifié" };

  const parsed = onboardingSchema.safeParse({ role });
  if (!parsed.success) return { error: "Rôle invalide" };

  await setUserRole(session.user.id, parsed.data.role);
  return {};
}
