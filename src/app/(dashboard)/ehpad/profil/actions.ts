"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ehpadProfileSchema } from "@/lib/validations/profiles";
import {
  createEhpadProfile,
  updateEhpadProfile,
  getEhpadProfileByUserId,
} from "@/lib/queries/ehpad-profiles";

export interface EhpadProfileFormState {
  error?: string;
  success?: boolean;
}

export async function saveEhpadProfileAction(data: unknown): Promise<EhpadProfileFormState> {
  const session = await auth();
  if (session?.user.role !== "EHPAD") return { error: "Non autorisé" };

  const parsed = ehpadProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const input = {
    ...parsed.data,
    description: parsed.data.description || null,
    contactPhone: parsed.data.contactPhone || null,
    contactEmail: parsed.data.contactEmail || null,
  };

  const existing = await getEhpadProfileByUserId(session.user.id);
  if (existing) {
    await updateEhpadProfile(session.user.id, input);
  } else {
    await createEhpadProfile(session.user.id, input);
  }

  revalidatePath("/ehpad/profil");
  return { success: true };
}
