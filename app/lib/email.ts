import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  return new Resend(key);
}

export async function sendEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    console.warn("CONTACT_EMAIL not set, skipping email");
    return;
  }

  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return;
  }

  await resend.emails.send({
    from: "Opinia <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}
