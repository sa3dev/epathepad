import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  name: z.string().min(1, "Nom requis"),
  role: z.enum(["EHPAD", "ARTIST"]),
});

export const credentialsSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export const onboardingSchema = z.object({
  role: z.enum(["EHPAD", "ARTIST"]),
});
