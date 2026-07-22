import { ResetForm } from "./reset-form";

export default async function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Lien invalide</h1>
        <p className="text-muted-foreground">
          Ce lien de réinitialisation est incomplet. Demandez-en un nouveau depuis la page de
          connexion.
        </p>
      </div>
    );
  }

  return <ResetForm token={token} email={email} />;
}
