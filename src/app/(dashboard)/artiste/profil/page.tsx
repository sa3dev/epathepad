import { auth } from "@/lib/auth";
import { getArtistProfileByUserId } from "@/lib/queries/artist-profiles";
import { listMediaForArtist } from "@/lib/queries/media";
import { ArtistProfileForm } from "./profile-form";
import { MediaUploader } from "./media-uploader";

export default async function ArtistProfilePage() {
  const session = await auth();
  const profile = await getArtistProfileByUserId(session!.user.id);
  const media = profile ? await listMediaForArtist(profile.id) : [];

  return (
    <div className="flex max-w-xl flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-extrabold text-foreground">Mon profil artiste</h1>
        <ArtistProfileForm profile={profile} />
      </div>

      {profile && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-foreground">Photos et vidéos</h2>
          <MediaUploader initialMedia={media} />
        </div>
      )}
    </div>
  );
}
