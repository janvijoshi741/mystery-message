import * as z from "zod";

export const verifySchema = z.object({
    code: z.string()
  });