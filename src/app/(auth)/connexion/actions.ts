"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { getUserByEmail } from "@/lib/queries/users";
import { credentialsSignInSchema, magicLinkSchema } from "@/lib/validations/auth";

export interface SignInState {
  error?: string;
}

function homeForRole(role: "EHPAD" | "ARTIST" | null | undefined) {
  if (role === "EHPAD") return "/ehpad/artistes";
  if (role === "ARTIST") return "/artiste/profil";
  return "/onboarding";
}

export async function credentialsSignInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
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
