import { z } from "zod";

export const ChurchSchema = z.object({
  congregation: z.string().min(1, "Congregation is required"),
  regionId: z.string().min(1, "Region is required"),
  districtChurch: z.string().min(1, "Church district is required"),
  presbyteryId: z.string().min(1, "Presbytery is required"),
  guardianName: z.string().min(1, "Guardian name is required"),
  guardianContact: z.string().min(1, "Guardian contact is required"),
});

export type ChurchInput = z.infer<typeof ChurchSchema>;
