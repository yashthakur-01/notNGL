import { auth } from "@/auth";
import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const session = await auth();
    const  user  = session?.user;

    console.log(session,user);

    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    await connectToDB();

    try {

        const reqBody = await request.json();

        const { acceptMessage } = reqBody;

        if (acceptMessage == null) {
            return NextResponse.json({
                success: false,
                message: "Please pass the acceptMessage parameter"
            }, { status: 401 })
        }

        const userId = user.id;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessage},
            {new:true}
        )

        if(!updatedUser){
            return NextResponse.json({
                success: false,
                message: "Unable to update the message accepting status"
            }, { status: 400 })
        }

        return NextResponse.json({
            success:true,
            message:"user message accepting status updated successfully"
        },{status:201})


    } catch (error) {
        console.log("error occured.\n", error);
        if (error instanceof Error) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 })
        }
    }
}


export async function GET(request: NextRequest){
    const session = await auth();
    const  user  = session?.user;

    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated",
            session,
            user
        }, { status: 401 })
    }

    console.log(session,user);

    await connectToDB();

    try {

        const userId = user.id;

        const existingUser = await UserModel.findById(userId);

        if(!existingUser){
            return NextResponse.json({
                success:false,
                message:"User doesnot exist"
            },{status:404})
        }

        return NextResponse.json({
            success:true,
            message:"User accept message status fetched successfully",
            isAcceptingMessage:existingUser.isAcceptingMessage
        },{status:201})
        
    } catch (error) {
        console.log("error occured:\n",error);
        if(error instanceof Error){
            return NextResponse.json({
                success:false,
                message:error.message
            },{status:500})
        }
    }
}