import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/model/user.model";

export async function POST(request: NextRequest) {


    const { username, content } = await request.json();

    if (!username || !content) {
        return NextResponse.json({
            success: false,
            message: "please provide content/username"
        }, { status: 401 })
    }

    await connectToDB();

    try {

        const user = await UserModel.findOne({ username });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user doesnot exist"
            }, { status: 404 });
        }

        if (!(user.isAcceptingMessage)) {
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 404 });
        }

        const userMessage = { content, createdAt: new Date() }

        user.messages.push(userMessage as Message);

        const savedUser = await user.save()

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            user: savedUser
        }, { status: 201 });
    }


    catch (error) {
        console.log("error occured:\n", error);
        if (error instanceof Error) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 });
        }

    }
}
