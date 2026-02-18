import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP settings are missing. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to .env.');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });

  return transporter;
}

export async function sendNewsletterEmail({ to, subject, bodyHtml, bodyText }) {
  const from = process.env.MAIL_FROM;

  if (!from) {
    throw new Error('MAIL_FROM is missing in .env.');
  }

  await getTransporter().sendMail({
    from,
    to,
    subject,
    text: bodyText,
    html: bodyHtml
  });
}
