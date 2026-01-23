import { z } from 'zod';



export const SignInSchema = z.object({
    email: z.string(),
    password: z.string().min(6,{message:"password must be atleast 6 characters"})
})