import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ArtisteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user.role !== "ARTIST") redirect("/ehpad/artistes");

  return <>{children}</>;
}
