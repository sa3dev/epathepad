import { auth } from "@/lib/auth";
import { getEhpadProfileByUserId } from "@/lib/queries/ehpad-profiles";
import { EhpadProfileForm } from "./profile-form";

export default async function EhpadProfilePage() {
  const session = await auth();
  const profile = await getEhpadProfileByUserId(session!.user.id);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-foreground">Mon profil EHPAD</h1>
      <EhpadProfileForm profile={profile} />
    </div>
  );
}
