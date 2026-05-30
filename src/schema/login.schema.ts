import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (val) => {
        const isEmail = /^\S+@\S+\.\S+$/.test(val);
        const isPhone = /^\+?[\d\s\-()]{7,}$/.test(val);
        return isEmail || isPhone;
      },
      { message: "Enter a valid email or phone number" }
    ),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
