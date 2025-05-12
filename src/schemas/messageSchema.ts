import * as z from "zod"

export const messageSchema = ({
Content: z.string()
 .min(10, { message: "Content must be at least 10 character long" })
 .max(300, { message: "Content must be at least 300 character long" })
})