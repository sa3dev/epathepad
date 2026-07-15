import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (!session.user.role) redirect("/onboarding");

  return <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>;
}
