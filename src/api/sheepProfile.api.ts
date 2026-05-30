// src/api/sheepProfile.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export interface ShepherdSnippet {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  institution: string | null;
  programme: string | null;
  position: string | null;
}

export interface SheepProfileFull {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;

  institution: string | null;
  institutionId: string | null;
  programme: string | null;
  programmeId: string | null;
  region: string | null;
  regionId: string | null;
  residence: string | null;
  whatsapp: string | null;
  highSchool: string | null;
  congregation: string | null;
  districtChurch: string | null;
  guardianName: string | null;
  guardianContact: string | null;
  birthDay: number | null;
  birthMonth: number | null;

  shepherdId: string | null;
  shepherdName: string | null;
  shepherd: ShepherdSnippet | null; // ← new

  sessionsAttended: number;
  totalSessions: number;
  attendanceRate: number;
}

export interface UpdateSheepProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  residence?: string;
  whatsapp?: string;
  highSchool?: string;
  congregation?: string;
  districtChurch?: string;
  guardianName?: string;
  guardianContact?: string;
}

export const getMyProfile = async (): Promise<SheepProfileFull> => {
  const { data } =
    await BASE_API.get<ApiResponse<SheepProfileFull>>("/sheep-profile/me");
  return data.data;
};

export const updateMyProfile = async (
  input: UpdateSheepProfileInput,
): Promise<SheepProfileFull> => {
  const { data } = await BASE_API.patch<ApiResponse<SheepProfileFull>>(
    "/sheep-profile/me",
    input,
  );
  return data.data;
};
