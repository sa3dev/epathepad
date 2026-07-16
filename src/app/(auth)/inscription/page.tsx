import { RegisterForm } from "./register-form";

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = role === "ARTIST" ? "ARTIST" : "EHPAD";

  return <RegisterForm initialRole={initialRole} />;
}
