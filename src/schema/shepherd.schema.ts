import { z } from "zod";

export const ShepherdSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    inviteToken: z.string().min(1, "Invalid invite link"),

    // Academic — required
    institutionId: z.string().min(1, "Institution is required"),
    level: z.enum(["100", "200", "300", "400", "500", "600", "Postgraduate"], {
      error: "Please select your level",
    }),

    programmeId: z.string().nullable().default(null),
    programmeName: z.string().nullable().default(null),
    hostelId: z.string().nullable().default(null),
    hostelName: z.string().nullable().default(null),
    wing: z.string().nullable().default(null),
    position: z.string().nullable().default(null),
    regionId: z.string().min(1, "Region is required"),
    regionName: z.string().nullable().default(null),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ShepherdInput = z.infer<typeof ShepherdSchema>;
// All nullable fields infer as `string | null` — no undefined anywhere
