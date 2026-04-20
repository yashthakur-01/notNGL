import { auth } from "@/auth";
import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {

    const session = await auth();
    const user = session?.user;

    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = user.id;

    await connectToDB();

    try {

        const existingUser = await UserModel.aggregate([
            { $match: { _id:new Types.ObjectId(userId) } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!existingUser || !existingUser.length) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "user messages fetched successfylly",
            messages: existingUser[0].messages
        }, { status: 201 });

    } catch (error) {
        // console.log("error occured:\n", error);
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message,
                success: false
            }, {
                status: 500
            })
        }
    }
}