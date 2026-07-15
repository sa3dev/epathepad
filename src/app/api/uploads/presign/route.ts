import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getArtistProfileByUserId } from "@/lib/queries/artist-profiles";
import { createPresignedUploadUrl } from "@/lib/s3";

const bodySchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ARTIST") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const artistProfile = await getArtistProfileByUserId(session.user.id);
  if (!artistProfile) {
    return Response.json({ error: "Profil artiste introuvable" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const result = await createPresignedUploadUrl({
    artistProfileId: artistProfile.id,
    contentType: parsed.data.contentType,
  });

  return Response.json(result);
}
