import mongoose from "mongoose";
import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    console.log("[VERIFY] Handler called");
    const requestBody = await request.json();
    // Accept both verifyCode and VerifyCode for robustness
    const id = requestBody.id;
    let verifyCode = (requestBody.verifyCode ?? requestBody.VerifyCode ?? "").toString().trim();
    console.log("[VERIFY] Received:", { id, verifyCode });

    // we might need to decode the component if we receive then through the uri to decode the special characters
    // const decodedUsername = decodeURIComponent(username);
    await connectToDB();
    console.log("[VERIFY] Connected to DB");
    try {
        if (!id || !verifyCode) {
            return NextResponse.json({
                success: false,
                message: "ID or code is missing"
            }, { status: 400 })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: "Invalid user ID"
            }, { status: 400 });
        }
        const existingUser = await UserModel.findById(String(id));
        console.log("[VERIFY] User found:", existingUser ? existingUser.username : null, existingUser ? existingUser.email : null, existingUser ? existingUser.verifyCode : null, existingUser ? existingUser.verifyCodeExpiry : null);

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User with these credentials donot exist. Sign-up first"
            }, { status: 400 });
        }

        if (existingUser?.isVerified) {
            return NextResponse.json({ success: true, message: "User is already verified" }, { status: 201 });
        }

        // Ensure both codes are strings and trimmed
        const codeFromUser = String(verifyCode).trim();
        const codeFromDb = String(existingUser.verifyCode).trim();
        const isCodeMatch = codeFromUser === codeFromDb;
        const isExpired = Date.now() > existingUser?.verifyCodeExpiry.getTime();
        console.log("[VERIFY] Comparing codes:", { codeFromUser, codeFromDb, isCodeMatch, isExpired });
        if (!isCodeMatch || isExpired) {
            return NextResponse.json({
                success: false,
                message: "Incorrect or expired Verify code"
            }, { status: 400 })
        }
        // Final check: ensure no one else verified with this username while we were waiting
        const usernameAlreadyClaimed = await UserModel.findOne({
            username: existingUser.username,
            isVerified: true,
            _id: { $ne: existingUser._id }
        });

        if (usernameAlreadyClaimed) {
            return NextResponse.json({
                success: false,
                message: "This username was claimed by someone else. Please sign up again with a different username."
            }, { status: 409 });
        }

        existingUser.isVerified = true;
        const savedUser = await existingUser.save();

        // Clean up other unverified users with the same username
        await UserModel.deleteMany({
            username: existingUser.username,
            isVerified: false,
            _id: { $ne: existingUser._id }
        });

        return NextResponse.json({
            success: true,
            message: "Username Verified Successfully"
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 });
        }
    }
}