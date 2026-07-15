"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { artistProfileSchema } from "@/lib/validations/profiles";
import {
  createArtistProfile,
  updateArtistProfile,
  getArtistProfileByUserId,
} from "@/lib/queries/artist-profiles";
import { addMedia, deleteMedia } from "@/lib/queries/media";
import type { MediaType } from "@/lib/types";

export interface ArtistProfileFormState {
  error?: string;
  success?: boolean;
}

export async function saveArtistProfileAction(data: unknown): Promise<ArtistProfileFormState> {
  const session = await auth();
  if (session?.user.role !== "ARTIST") return { error: "Non autorisé" };

  const parsed = artistProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const input = { ...parsed.data, bio: parsed.data.bio || null, contactPhone: parsed.data.contactPhone || null };

  const existing = await getArtistProfileByUserId(session.user.id);
  if (existing) {
    await updateArtistProfile(session.user.id, input);
  } else {
    await createArtistProfile(session.user.id, input);
  }

  revalidatePath("/artiste/profil");
  return { success: true };
}

export async function addMediaAction(data: { url: string; type: MediaType }): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user.role !== "ARTIST") return { error: "Non autorisé" };

  const profile = await getArtistProfileByUserId(session.user.id);
  if (!profile) return { error: "Créez d'abord votre profil" };

  await addMedia({ artistProfileId: profile.id, url: data.url, type: data.type });
  revalidatePath("/artiste/profil");
  return {};
}

export async function deleteMediaAction(mediaId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (session?.user.role !== "ARTIST") return { error: "Non autorisé" };

  const profile = await getArtistProfileByUserId(session.user.id);
  if (!profile) return { error: "Profil introuvable" };

  await deleteMedia(mediaId, profile.id);
  revalidatePath("/artiste/profil");
  return {};
}
