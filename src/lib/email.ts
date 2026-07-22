// Single seam for sending transactional email. In dev, messages are logged to the
// console (no SMTP setup needed to test flows locally). In prod, this calls SMTP via
// nodemailer — swap the transport in `sendEmail` for another provider (Resend, etc.)
// if needed; that's the one place that needs to change.
async function sendEmail(params: { to: string; subject: string; text: string; html: string }): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n[dev] Email "${params.subject}" pour ${params.to} :\n${params.text}\n`);
    return;
  }

  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) {
    throw new Error("SMTP_HOST is not set — cannot send email in production");
  }

  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });

  await transport.sendMail({
    to: params.to,
    from: process.env.EMAIL_FROM ?? "Épat'Ehpad <no-reply@epatehpad.fr>",
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
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
