// Single seam for sending the magic-link email. In dev, the link is logged to the
// console (no SMTP setup needed to test the flow locally). In prod, swap the body
// of the `else` branch for a real transport (SMTP via nodemailer, Resend, etc.) —
// this is the one place that needs to change.
export async function sendMagicLinkEmail(to: string, url: string): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n[dev] Lien de connexion pour ${to} :\n${url}\n`);
    return;
  }

  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) {
    throw new Error("SMTP_HOST is not set — cannot send magic-link email in production");
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
    to,
    from: process.env.EMAIL_FROM ?? "Épat'Ehpad <no-reply@epatehpad.fr>",
    subject: "Votre lien de connexion Épat'Ehpad",
    text: `Cliquez sur ce lien pour vous connecter : ${url}`,
    html: `<p>Cliquez sur ce lien pour vous connecter à Épat'Ehpad :</p><p><a href="${url}">${url}</a></p>`,
  });
}
