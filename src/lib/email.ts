import { Resend } from "resend";

// Single seam for sending transactional email. In dev, messages are logged to the
// console (no API key needed to test flows locally). In prod, this calls Resend —
// swap the body of the `else` branch for another provider if needed; that's the
// one place that needs to change.
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set — cannot send email in production");
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

async function sendEmail(params: { to: string; subject: string; text: string; html: string }): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n[dev] Email "${params.subject}" pour ${params.to} :\n${params.text}\n`);
    return;
  }

  const { error } = await getResendClient().emails.send({
    to: params.to,
    from: process.env.EMAIL_FROM ?? "Épat'Ehpad <onboarding@resend.dev>",
    subject: params.subject,
    text: params.text,
    html: params.html,
  });

  if (error) {
    throw new Error(`Resend a refusé l'envoi de l'email : ${error.message}`);
  }
}

export async function sendMagicLinkEmail(to: string, url: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Votre lien de connexion Épat'Ehpad",
    text: `Cliquez sur ce lien pour vous connecter : ${url}`,
    html: `<p>Cliquez sur ce lien pour vous connecter à Épat'Ehpad :</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendPasswordResetEmail(to: string, url: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Réinitialisez votre mot de passe Épat'Ehpad",
    text: `Cliquez sur ce lien pour choisir un nouveau mot de passe (valable 1 heure) : ${url}`,
    html: `<p>Cliquez sur ce lien pour choisir un nouveau mot de passe (valable 1 heure) :</p><p><a href="${url}">${url}</a></p>`,
  });
}
