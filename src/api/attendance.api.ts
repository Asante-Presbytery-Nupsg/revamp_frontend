// src/api/attendance.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export interface AttendanceSession {
  id: string;
  sheepId: string;
  shepherdId: string;
  date: string;
  status: AttendanceStatus;
  notes: string | null;
  recordedById: string | null;
  createdAt: string;
  updatedAt: string;
}
export type AttendanceStatus = "present" | "absent";
export interface MyHistoryRow {
  id: string;
  date: string;
  status: "present" | "absent";
  notes: string | null;
  markedBy: string;
}

export interface MyHistoryQuery {
  status?: "present" | "absent";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface MyHistoryResponse {
  success: boolean;
  data: MyHistoryRow[];
  total: number;
  page: number;
  limit: number;
  stats: {
    total: number;
    present: number;
    absent: number;
    rate: number;
  };
}

export interface EnrichedSession {
  id: string;
  date: string;
  status: AttendanceStatus;
  notes: string | null;
  sheepId: string;
  sheep: string;
  institution: string | null;
}

export interface GroupedAttendance {
  shepherdId: string;
  shepherd: string;
  sessions: EnrichedSession[];
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  rate: number;
}

export interface AttendanceQuery {
  shepherdId?: string;
  sheepId?: string;
  status?: AttendanceStatus;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateAttendanceInput {
  sheepId: string;
  shepherdId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export type UpdateAttendanceInput = Partial<CreateAttendanceInput>;

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateAttendanceInput {
  sheepId: string;
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  sheepId: string;
  date: string;
  status: AttendanceStatus;
  notes: string | null;
  createdAt: string;
}

export const getAttendance = async (
  query: AttendanceQuery = {},
): Promise<PaginatedResponse<AttendanceSession>> => {
  const { data } = await BASE_API.get<PaginatedResponse<AttendanceSession>>(
    "/attendance",
    { params: query },
  );
  return data;
};

export interface GroupedAttendanceQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export const getAttendanceGrouped = async (
  query: GroupedAttendanceQuery = {},
): Promise<PaginatedResponse<GroupedAttendance>> => {
  const { data } = await BASE_API.get<PaginatedResponse<GroupedAttendance>>(
    "/attendance",
    { params: { grouped: true, ...query } },
  );
  return data;
};

export const getAttendanceById = async (
  id: string,
): Promise<AttendanceSession> => {
  const { data } = await BASE_API.get<ApiResponse<AttendanceSession>>(
    `/attendance/${id}`,
  );
  return data.data;
};

export const getAttendanceStats = async (
  params: {
    shepherdId?: string;
    from?: string;
    to?: string;
  } = {},
): Promise<AttendanceStats> => {
  const { data } = await BASE_API.get<ApiResponse<AttendanceStats>>(
    "/attendance/stats",
    { params },
  );
  return data.data;
};

export interface CreateAttendanceInput {
  sheepId: string;
  date: string; // ISO date string "YYYY-MM-DD", backend coerces
  status: AttendanceStatus;
  notes?: string;
  // shepherdId intentionally omitted — injected from req.user on backend
}

export const createAttendance = async (
  input: CreateAttendanceInput,
): Promise<AttendanceRecord> => {
  const { data } = await BASE_API.post<ApiResponse<AttendanceRecord>>(
    "/attendance",
    input,
  );
  return data.data;
};

export const updateAttendance = async (
  id: string,
  input: UpdateAttendanceInput,
): Promise<AttendanceSession> => {
  const { data } = await BASE_API.patch<ApiResponse<AttendanceSession>>(
    `/attendance/${id}`,
    input,
  );
  return data.data;
};

export const deleteAttendance = async (id: string): Promise<void> => {
  await BASE_API.delete(`/attendance/${id}`);
};

export const getMyAttendanceHistory = async (
  query: MyHistoryQuery = {},
): Promise<MyHistoryResponse> => {
  const { data } = await BASE_API.get<MyHistoryResponse>(
    "/attendance/my/history",
    { params: query },
  );
  return data;
};
