import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest) {

    await connectToDB();

    try {
        const { searchParams } = new URL(request.url);
        const checkUsername = searchParams.get('username')

        if (!checkUsername) {
            return NextResponse.json({
                success: false,
                message: "username is required"
            }, { status: 400 });
        }
        const result = UsernameQuerySchema.safeParse({ username: checkUsername });
        // console.log(result);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors ?? [];
            return NextResponse.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(", ") : "Invalid username"
            }, { status: 400 });
        }

        const { username } = result.data;

        const ExistingUserByUsername = await UserModel.findOne({ username, isVerified: true });

        if (ExistingUserByUsername) {
            return NextResponse.json({ success: false, message: "username already exists" }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Username is available" }, {
            status: 200
        });

    } catch (error: any) {
        // console.log(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}