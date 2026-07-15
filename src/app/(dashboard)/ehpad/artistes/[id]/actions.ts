"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { contactRequestSchema } from "@/lib/validations/contact-request";
import { getEhpadProfileByUserId } from "@/lib/queries/ehpad-profiles";
import { createContactRequest } from "@/lib/queries/contact-requests";

export async function sendContactRequestAction(
  data: unknown,
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (session?.user.role !== "EHPAD") return { error: "Non autorisé" };

  const parsed = contactRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const ehpadProfile = await getEhpadProfileByUserId(session.user.id);
  if (!ehpadProfile) return { error: "Complétez d'abord votre profil EHPAD" };

  await createContactRequest({
    ehpadProfileId: ehpadProfile.id,
    artistProfileId: parsed.data.artistProfileId,
    message: parsed.data.message,
  });

  revalidatePath("/ehpad/demandes");
  return { success: true };
}
