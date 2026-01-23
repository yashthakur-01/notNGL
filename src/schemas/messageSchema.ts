import { z } from 'zod';



export const messageSchema = z.object({
    content: z.string().min(1,{message:"Content must be of atleast 10 charaters"})
    .max(300,"Content must be less than equal to 300 charaters.")
})