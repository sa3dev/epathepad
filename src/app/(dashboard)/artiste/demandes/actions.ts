"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getArtistProfileByUserId } from "@/lib/queries/artist-profiles";
import { respondToContactRequest } from "@/lib/queries/contact-requests";
import { contactRequestResponseSchema } from "@/lib/validations/contact-request";

export async function respondToRequestAction(data: unknown): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user.role !== "ARTIST") return { error: "Non autorisé" };

  const parsed = contactRequestResponseSchema.safeParse(data);
  if (!parsed.success) return { error: "Requête invalide" };

  const profile = await getArtistProfileByUserId(session.user.id);
  if (!profile) return { error: "Profil introuvable" };

  const updated = await respondToContactRequest({
    id: parsed.data.requestId,
    artistProfileId: profile.id,
    status: parsed.data.status,
    artistReply: parsed.data.artistReply || null,
  });
  if (!updated) return { error: "Demande introuvable" };

  revalidatePath("/artiste/demandes");
  return {};
}
