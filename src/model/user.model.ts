import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const UserSchema = new Schema<User>({
    username: { type: String, required: [true, "Username is required"], trim: true, unique: true },
    email: { type: String, unique: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, " Please enter valid email."], required: [true, "Email is required"] },
    password: { type: String, required: true },
    verifyCode: { type: String, required: true },
    verifyCodeExpiry: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    isAcceptingMessage: { type: Boolean, default: true },
    messages: [MessageSchema]
})


export const UserModel = (mongoose.models?.mstryUser as mongoose.Model<User>) || (mongoose.model<User>("mstryUser", UserSchema))

