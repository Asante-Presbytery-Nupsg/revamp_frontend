import { z } from "zod";
import {
  PersonalInfoSchema,
  type PersonalInfoInput,
} from "./personalInfo.schema";
import { EducationSchema, type EducationInput } from "./education.schema";
import { ChurchSchema, type ChurchInput } from "./church.schema";

export { PersonalInfoSchema, type PersonalInfoInput };
export { EducationSchema, type EducationInput };
export { ChurchSchema, type ChurchInput };

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

export const MultiStepUserSchema = z
  .object({
    // Step 1 — Personal
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
    confirmPassword: z.string().min(1, "Please confirm your password"),

    // Step 2 — Education
    programmeId: z.string().optional().nullable(),
    programmeName: z.string().optional().nullable(),
    institutionId: z.string().optional().nullable(),
    institutionName: z.string().optional().nullable(),
    residence: z.string().optional(),
    highSchool: z.string().min(1, "High school is required"),

    // Step 3 — Church
    congregation: z.string().min(1, "Congregation is required"),
    regionId: z.string().min(1, "Region is required"),
    districtChurch: z.string().min(1, "Church district is required"),
    presbyteryId: z.string().min(1, "Presbytery is required"),
    guardianName: z.string().min(1, "Guardian name is required"),
    guardianContact: z.string().min(1, "Guardian contact is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Types ────────────────────────────────────────────────────────────────────

// camelCase — what RHF and the form work with throughout
export type MultiStepUserFormInput = PersonalInfoInput &
  EducationInput &
  ChurchInput;

// snake_case — what the backend API expects
export type MultiStepUserPayload = {
  first_name: string;
  last_name: string;
  other_name?: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  password?: string;
  confirmPassword?: string;
  birth_day: number | undefined;
  birth_month: number | undefined;
  programme_id?: string | null;
  programme_name?: string | null;
  institution_id?: string | null;
  institution_name?: string | null;
  residence?: string;
  high_school: string;
  congregation: string;
  region_id: string;
  district_church: string;
  presbytery_id: string;
  guardian_name: string;
  guardian_contact: string;
};

// ─── Transform ────────────────────────────────────────────────────────────────
export const toPayload = (
  data: MultiStepUserFormInput,
): MultiStepUserPayload => ({
  first_name: data.firstName,
  last_name: data.lastName,
  other_name: data.otherName || undefined,
  email: data.email || undefined,
  phone: data.phone,
  whatsapp: data.whatsapp || undefined,
  birth_day: data.birthDay,
  birth_month: data.birthMonth,
  password: data.password || undefined,
  confirmPassword: data.confirmPassword || undefined,
  programme_id: data.programmeId ?? null,
  programme_name: data.programmeName ?? null,
  institution_id: data.institutionId ?? null,
  institution_name: data.institutionName ?? null,
  residence: data.residence || undefined,
  high_school: data.highSchool,
  congregation: data.congregation,
  region_id: data.regionId,
  district_church: data.districtChurch,
  presbytery_id: data.presbyteryId,
  guardian_name: data.guardianName,
  guardian_contact: data.guardianContact,
});
