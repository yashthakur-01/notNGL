import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER || process.env.GMAIL_EMAIL || "";
const gmailPass = process.env.GMAIL_PASS || process.env.GMAIL_PASSWORD || "";

export const hasGmailCredentials = Boolean(gmailUser && gmailPass);

export function createGmailTransporter() {
  if (!hasGmailCredentials) {
    throw new Error(
      "Missing Gmail credentials. Set GMAIL_USER (or GMAIL_EMAIL) and GMAIL_PASS (or GMAIL_PASSWORD)."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
}

export { gmailUser };
