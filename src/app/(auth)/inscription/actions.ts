"use server";

import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { getUserByEmail, createUser, setUserRole } from "@/lib/queries/users";
import { signIn } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export interface RegisterState {
  error?: string;
}

const TOO_MANY_ATTEMPTS = "Trop de tentatives. Réessayez dans quelques minutes.";

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const ip = await getClientIp();
  if (!checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: TOO_MANY_ATTEMPTS };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    acceptTerms: formData.get("acceptTerms"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const existing = await getUserByEmail(parsed.data.email);
  if (existing) {
    return { error: "Un compte existe déjà avec cet email" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await createUser({
    email: parsed.data.email,
    name: parsed.data.name,
    passwordHash,
  });
  await setUserRole(user.id, parsed.data.role);

  const home = parsed.data.role === "EHPAD" ? "/ehpad/profil" : "/artiste/profil";

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: home,
  });

  return {};
}
