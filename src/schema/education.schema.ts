import { z } from "zod";

// Base object without superRefine so it can be safely merged
export const EducationBaseSchema = z.object({
  programmeId: z.string().optional().nullable(),
  programmeName: z.string().optional().nullable(),
  institutionId: z.string().optional().nullable(),
  institutionName: z.string().optional().nullable(),
  residence: z.string().optional(),
  highSchool: z.string().min(1, "High school is required"),
});

// Full schema with cross-field validation — use this for step 2 resolver
export const EducationSchema = EducationBaseSchema.superRefine((data, ctx) => {
  const programmeId = (data.programmeId ?? "").trim();
  const programmeName = (data.programmeName ?? "").trim();

  if (!programmeId && !programmeName) {
    ctx.addIssue({
      path: ["programmeId"],
      code: "custom",
      message: "Please select or enter a programme",
    });
    ctx.addIssue({
      path: ["programmeName"],
      code: "custom",
      message: "Or type your programme name here",
    });
  }

  const institutionId = (data.institutionId ?? "").trim();
  const institutionName = (data.institutionName ?? "").trim();

  if (!institutionId && !institutionName) {
    ctx.addIssue({
      path: ["institutionId"],
      code: z.ZodIssueCode.custom,
      message: "Please select or enter an institution",
    });
    ctx.addIssue({
      path: ["institutionName"],
      code: z.ZodIssueCode.custom,
      message: "Or type your institution name here",
    });
  }
});

export type EducationInput = z.infer<typeof EducationSchema>;
