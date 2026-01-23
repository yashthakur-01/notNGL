import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { NextRequest,NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest){
    const requestBody = await request.json();
    const {username, verifyCode} = requestBody;

    // we might need to decode the component if we receive then through the uri to decode the special characters
    // const decodedUsername = decodeURIComponent(username);
    await connectToDB();
    try {
        if(!username || !verifyCode){
            return NextResponse.json({
                success:false,
                message:"username or code is missing"
            },{status:400})
        }

        const existingUser = await UserModel.findOne({username});

        if(!existingUser){
            return NextResponse.json({
                success:false,
                message:"User with this username donot exist. Sign-up first"
            },{status:400});
        }
        
        if(existingUser?.isVerified){
            return NextResponse.json({success:true,message:"User is already verified"},{status:201});
        }

        if(verifyCode !== existingUser.verifyCode || Date.now()>existingUser?.verifyCodeExpiry.getTime()){
            return NextResponse.json({
                success:false,
                message:"Incorrect or expired Verify code"
            },{status:400})
        }

        existingUser.isVerified = true;
        const savedUser = await existingUser.save();
        return NextResponse.json({
            success:true,
            message:"Username Verified Successfully"
        },{status:201})  

    } catch (error) {
        console.log(error);
        if(error instanceof Error){
            return NextResponse.json({
                success:false,
                message:error.message
            },{status:500});
        }        
    }
}