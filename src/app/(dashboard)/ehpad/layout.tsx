import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function EhpadLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user.role !== "EHPAD") redirect("/artiste/profil");

  return <>{children}</>;
}
