// src/api/unionAttendance.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export type MeetingType =
  | "Sunday Service"
  | "Mid-week"
  | "Bible Study"
  | "Special Program";

export type Period = "monthly" | "quarterly" | "yearly";

export interface UnionAttendance {
  id: string;
  date: string;
  meeting: MeetingType;
  male: number;
  female: number;
  notes: string | null;
  recordedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UnionAttendanceStats {
  meetingCount: number;
  totalAttendance: number;
  avgAttendance: number;
  period: Period;
}

export interface UnionAttendanceQuery {
  meeting?: MeetingType;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateUnionAttendanceInput {
  date: string;
  meeting: MeetingType;
  male: number;
  female: number;
  notes?: string;
}

export type UpdateUnionAttendanceInput = Partial<CreateUnionAttendanceInput>;

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getUnionAttendance = async (
  query: UnionAttendanceQuery = {},
): Promise<PaginatedResponse<UnionAttendance>> => {
  const { data } = await BASE_API.get<PaginatedResponse<UnionAttendance>>(
    "/union-attendance",
    { params: query },
  );
  return data;
};

export const getUnionAttendanceById = async (
  id: string,
): Promise<UnionAttendance> => {
  const { data } = await BASE_API.get<ApiResponse<UnionAttendance>>(
    `/union-attendance/${id}`,
  );
  return data.data;
};

export const getUnionAttendanceStats = async (
  period: Period = "monthly",
): Promise<UnionAttendanceStats> => {
  const { data } = await BASE_API.get<ApiResponse<UnionAttendanceStats>>(
    "/union-attendance/stats",
    { params: { period } },
  );
  return data.data;
};

export const createUnionAttendance = async (
  input: CreateUnionAttendanceInput,
): Promise<UnionAttendance> => {
  const { data } = await BASE_API.post<ApiResponse<UnionAttendance>>(
    "/union-attendance",
    input,
  );
  return data.data;
};

export const updateUnionAttendance = async (
  id: string,
  input: UpdateUnionAttendanceInput,
): Promise<UnionAttendance> => {
  const { data } = await BASE_API.patch<ApiResponse<UnionAttendance>>(
    `/union-attendance/${id}`,
    input,
  );
  return data.data;
};

export const deleteUnionAttendance = async (id: string): Promise<void> => {
  await BASE_API.delete(`/union-attendance/${id}`);
};
