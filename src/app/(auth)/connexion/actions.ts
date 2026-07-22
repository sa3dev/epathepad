"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { getUserByEmail } from "@/lib/queries/users";
import { credentialsSignInSchema, magicLinkSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export interface SignInState {
  error?: string;
}

const TOO_MANY_ATTEMPTS = "Trop de tentatives. Réessayez dans quelques minutes.";

function homeForRole(role: "EHPAD" | "ARTIST" | null | undefined) {
  if (role === "EHPAD") return "/ehpad/artistes";
  if (role === "ARTIST") return "/artiste/profil";
  return "/onboarding";
}

export async function credentialsSignInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const ip = await getClientIp();
  if (!checkRateLimit(`signin:${ip}`, 10, 15 * 60 * 1000)) {
    return { error: TOO_MANY_ATTEMPTS };
  }

  const parsed = credentialsSignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Email ou mot de passe invalide" };

  const existingUser = await getUserByEmail(parsed.data.email);

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: homeForRole(existingUser?.role),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect" };
    }
    throw error;
  }

  return {};
}

export async function magicLinkSignInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = magicLinkSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Adresse email invalide" };

  const ip = await getClientIp();
  const withinIpLimit = checkRateLimit(`magiclink:ip:${ip}`, 10, 60 * 60 * 1000);
  const withinEmailLimit = checkRateLimit(`magiclink:email:${parsed.data.email}`, 3, 60 * 60 * 1000);
  if (!withinIpLimit || !withinEmailLimit) {
    return { error: TOO_MANY_ATTEMPTS };
  }

  try {
    await signIn("email", { email: parsed.data.email, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Impossible d'envoyer le lien de connexion" };
    }
    throw error;
  }

  return {};
}
