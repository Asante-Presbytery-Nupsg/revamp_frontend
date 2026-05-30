import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

export const PersonalInfoSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    otherName: z.string().optional(),
    email: z
      .union([z.literal(""), z.string().email("Invalid email address")])
      .optional(),
    phone: z.string().min(1, "Phone number is required"),
    whatsapp: z.string().optional(),
    birthDay: z
      .number()
      .int()
      .min(1, "Day is required")
      .max(31, "Invalid day")
      .optional()
      .refine((v) => v !== undefined, { message: "Day is required" }),
    birthMonth: z
      .number()
      .int()
      .min(1, "Month is required")
      .max(12, "Invalid month")
      .optional()
      .refine((v) => v !== undefined, { message: "Month is required" }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PersonalInfoInput = z.infer<typeof PersonalInfoSchema>;
