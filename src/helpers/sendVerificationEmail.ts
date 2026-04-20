import { Resend } from "resend";
import { ApiResponse } from "@/types/apiResponse";

import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string
): Promise<ApiResponse> {
    try {

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message || Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });


        return { success: true, message: "verification email send successfully" }

    } catch (emailErr) {
        // console.error("Error sending verification email.", emailErr)
        return { success: false, message: 'Failed to send verification email' }
    }
}

