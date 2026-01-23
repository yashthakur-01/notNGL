import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { Types } from "mongoose";


export interface UserInterface {
  _id?: Types.ObjectId; // ✅ FIX
  email?: string;
  username?: string;
  password?: string;
  isVerified?: boolean;
  isAcceptingMessage?: boolean;
}

export async function POST(request: Request) {

    await connectToDB();

    try {

        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username, isVerified: true
        })

        if (existingUserVerifiedByUsername) { 
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exist with this email.'
                }, {
                    status: 400
                })
            } else {

                const hashedPass = await bcrypt.hash(password, 10)

                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)

                existingUserByEmail.password = hashedPass;

                existingUserByEmail.verifyCode = verifyCode;
                
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();


            }

        } else {
            const hashedPass = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPass,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        console.log(emailResponse)

        return Response.json({
            success: true,
            message: 'User Registered Successfully. Please Verify the code through email.'
        }, {
            status: 201
        })


    } catch (err) {
        console.error('Error registering user', err)
        return Response.json({
            success: false,
            message: 'Error registering User'
        }, {
            status: 500
        })
    }

}