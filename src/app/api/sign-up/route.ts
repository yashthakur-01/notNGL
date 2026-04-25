import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import bcrypt from 'bcryptjs';

import { sendVerificationEmailGmail } from "@/helpers/sendVerificationEmailGmail";
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
        console.log("[SIGNUP] Received:", { username, email, password });

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, {
                status: 400
            })
        }

        // Always generate code and expiry ONCE per request
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        console.log("[SIGNUP] verifyCode, expiryDate:", verifyCode, expiryDate);

        const existingUserByEmail = await UserModel.findOne({ email });
        let userToEmail;
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                console.log("[SIGNUP] Existing verified user:", { username, email });
                return Response.json({
                    success: false,
                    message: 'User already exist with this email.'
                }, {
                    status: 400
                })
            } else {
                const hashedPass = await bcrypt.hash(password, 10);
                // Always update both code and expiry
                existingUserByEmail.password = hashedPass;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                existingUserByEmail.username = username; 
                await existingUserByEmail.save();
                userToEmail = existingUserByEmail;
                console.log("[SIGNUP] Updated existing user:", { username, email, verifyCode, expiryDate });
            }
        } else {
            const hashedPass = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPass,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            await newUser.save();
            userToEmail = newUser;
            console.log("[SIGNUP] Created new user:", { username, email, verifyCode, expiryDate });
        }

        // Always send the code that was just saved
        const emailResponse = await sendVerificationEmailGmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }
        console.log(emailResponse);
        return Response.json({
            success: true,
            message: 'User Registered Successfully. Please Verify the code through email.',
            id: userToEmail._id?.toString()
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