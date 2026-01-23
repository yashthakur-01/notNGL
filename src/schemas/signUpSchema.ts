import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2, 'UserName must be atleast 2 Characters')
    .max(20, "UserName must be less than 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const SignUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(6,{message: "Password must be atleaset 6 characters"})
})