import BASE_API from "./base.api";
import type { ApiResponse, PaginatedResult } from "@/types/api.types";

// ─── Types

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  otherName?: string | null;
  email?: string | null;
  phoneNumber: string;
  whatsapp?: string | null;
  birthDay?: number | null;
  birthMonth?: number | null;
  highSchool: string;
  residence?: string | null;
  congregation: string;
  districtChurch: string;
  guardianName: string;
  guardianContact: string;
  institutionId?: string | null;
  institution?: string | null;
  programmeId?: string | null;
  programme?: string | null;
  regionId: string;
  region: string;
  presbyteryId: string;
  shepherdId?: string | null;
  isActive: boolean;
  role: "sheep";
  createdAt: string;
  updatedAt: string;
}

export interface MemberQuery {
  search?: string;
  status?: string;
  regionId?: string;
  presbyteryId?: string;
  institutionId?: string;
  shepherdId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
// ─── Endpoints

export const getMembers = async (
  query: MemberQuery = {},
): Promise<PaginatedResult<Member>> => {
  const { data } = await BASE_API.get<
    { success: boolean } & PaginatedResult<Member>
  >("/sheep", { params: query });
  return data;
};

export const getMemberById = async (id: string): Promise<Member> => {
  const { data } = await BASE_API.get<ApiResponse<Member>>(`/sheep/${id}`);
  return data.data;
};

export const approveMember = async (id: string): Promise<Member> => {
  const { data } = await BASE_API.patch<ApiResponse<Member>>(
    `/sheep/${id}/approve`,
  );
  return data.data;
};

export const assignShepherd = async (
  id: string,
  shepherdId: string,
): Promise<Member> => {
  const { data } = await BASE_API.patch<ApiResponse<Member>>(
    `/sheep/${id}/assign`,
    { shepherdId },
  );
  return data.data;
};

export const deleteMember = async (id: string): Promise<void> => {
  await BASE_API.delete(`/sheep/${id}`);
};
