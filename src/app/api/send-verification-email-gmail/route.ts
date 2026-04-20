import { sendVerificationEmailGmail } from "@/helpers/sendVerificationEmailGmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, username, verifyCode } = await request.json();

    if (!email || !username || !verifyCode) {
      return NextResponse.json(
        {
          success: false,
          message: "email, username or verifyCode is missing",
        },
        { status: 400 }
      );
    }

    const emailResponse = await sendVerificationEmailGmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(emailResponse, { status: 500 });
    }

    return NextResponse.json(emailResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
      },
      { status: 500 }
    );
  }
}
