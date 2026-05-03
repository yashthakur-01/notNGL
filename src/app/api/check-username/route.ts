import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const username = reqBody?.username?.trim();


    if (!username) {
        return NextResponse.json({ success: false, message: "enter username" }, { status: 400 });
    }
    await connectToDB();
    try {
        const user = await UserModel.findOne({ username, isVerified: true });
        if (user) {
            return NextResponse.json({ success: true, message: "username is valid" }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: "invalid username" }, { status: 404 });

    } catch (error) {
        // console.log(error);
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });

        }
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}
