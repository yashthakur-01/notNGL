import { ApiResponse } from "@/types/apiResponse";
import { createGmailTransporter, gmailUser } from "@/lib/gmailTransporter";

export async function sendVerificationEmailGmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = createGmailTransporter();

    await transporter.sendMail({
      from: gmailUser,
      to: email,
      subject: "Mystery Message || Verification code",
      text: `Hello ${username},\n\nYour verification code is: ${verifyCode}\n\nIf you did not request this code, please ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:560px;margin:0 auto;padding:16px;">
          <h2 style="margin:0 0 12px;">Hello ${username},</h2>
          <p style="margin:0 0 12px;">Thank you for registering. Use the verification code below to complete your signup.</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:4px;background:#f3f4f6;padding:12px 16px;border-radius:8px;display:inline-block;margin:4px 0 12px;">
            ${verifyCode}
          </div>
          <p style="margin:12px 0 0;color:#4b5563;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });

    return {
      success: true,
      message: "verification email send successfully",
    };
  } catch (emailErr) {
    // console.error("Error sending verification email with Gmail.", emailErr);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
