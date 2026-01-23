import { auth } from "@/auth";
import { UserModel } from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const session = await auth();
    const user = session?.user;

    const reqBody = await request.json();
    const {messageId} = reqBody;

    if(!user){
        return NextResponse.json({success:false,message:"Not authenticated"},{status:400});
    }

    if(!messageId){
        return NextResponse.json({success:false,message:"Message Id not provided"},{status:400});
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user.id
        ,{
            $pull:{
                messages: {_id:messageId}
            }
        },{new:true});


        if(!updatedUser){
            return NextResponse.json({success:false,message:"User or Message not found"},{status:400});
        }

        return NextResponse.json({success:true,message:"Message deleted successfully",messages:updatedUser.messages},{status:200});

    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({success:false,message:error.message},{status:500});
        }
        console.log("server error occured:\n",error);
    }

}