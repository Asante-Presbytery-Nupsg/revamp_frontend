import type { ApiResponse } from "@/types/api.types";
import BASE_API from "./base.api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShepherdQuery {
  search?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface CreateShepherdInput {
  name: string;
  email: string;
  phone: string;
  institution: string;
  level: string;
  position?: string;
}

export interface UpdateShepherdInput {
  name?: string;
  email?: string;
  phone?: string;
  institution?: string;
  level?: string;
  position?: string;
}
export interface ShepherdStats {
  total: number;
  active: number;
  inactive: number;
  totalSheep: number;
  avgAttendanceRate: number;
}

interface PaginatedResponse<T> {
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

export interface MySheep {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  institution: string | null;
  programme: string | null;
  residence: string | null;
  attendanceRate: number | null;
  sessionCount: number | null;
  lastSeen: string | null;
}

export interface MySheepQuery {
  page?: number;
  limit?: number;
}

export interface ShepherdSheep {
  shepherdId: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  institution: string | null;
  programme: string | null;
  attendanceRate: number | null;
}

export interface ShepherdRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  institutionName: string | null;
  shortName: string | null;
  programme: string | null;
  level: string | null;
  position: string | null;
  region: string | null;
  sheep: ShepherdSheep[];
}

export interface PendingShepherdRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  institutionName: string | null;
  shortName: string | null;
  programme: string | null;
  level: string | null;
  region: string | null;
}

export interface ShepherdProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  institutionName: string | null;
  programme: string | null;
  level: string | null;
  position: string | null;
  region: string | null;
  profileCreatedAt: string;
  // stats
  sheepCount: number;
  sessions: number;
  avgRate: number;
}

export interface UpdateShepherdProfileInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  institutionName?: string;
  programme?: string;
  level?: string;
  position?: string;
  region?: string;
}

export const getMyShepherdProfile = async (): Promise<ShepherdProfile> => {
  const { data } =
    await BASE_API.get<ApiResponse<ShepherdProfile>>("/shepherds/me");
  return data.data;
};

export const updateMyShepherdProfile = async (
  input: UpdateShepherdProfileInput,
): Promise<ShepherdProfile> => {
  const { data } = await BASE_API.patch<ApiResponse<ShepherdProfile>>(
    "/shepherds/profile",
    input,
  );
  return data.data;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getShepherds = async (
  query: ShepherdQuery = {},
): Promise<PaginatedResponse<ShepherdRecord>> => {
  const { data } = await BASE_API.get("/shepherds", { params: query });
  return data;
};

export const getShepherdById = async (id: string): Promise<ShepherdRecord> => {
  const { data } = await BASE_API.get(`/shepherds/${id}`);
  return data.data;
};

export const getShepherdStats = async (): Promise<ShepherdStats> => {
  const { data } = await BASE_API.get("/shepherds/stats");
  return data.data;
};

export const getPendingShepherds = async (): Promise<
  PaginatedResponse<PendingShepherdRecord>
> => {
  const { data } = await BASE_API.get("/shepherds/pending");
  return data;
};

export const getMySheep = async (
  params: {
    page?: number;
    limit?: number;
  } = {},
) => {
  const { data } = await BASE_API.get("/shepherds/my-sheep", { params });
  return data;
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createShepherd = async (
  input: CreateShepherdInput,
): Promise<ShepherdRecord> => {
  const { data } = await BASE_API.post("/shepherds", input);
  return data.data;
};

export const updateShepherd = async (
  id: string,
  input: UpdateShepherdInput,
): Promise<ShepherdRecord> => {
  const { data } = await BASE_API.patch(`/shepherds/${id}`, input);
  return data.data;
};

export const activateShepherd = async (id: string): Promise<ShepherdRecord> => {
  const { data } = await BASE_API.patch(`/shepherds/${id}/activate`);
  return data.data;
};

export const deactivateShepherd = async (
  id: string,
): Promise<ShepherdRecord> => {
  const { data } = await BASE_API.patch(`/shepherds/${id}/deactivate`);
  return data.data;
};

export const deleteShepherd = async (id: string): Promise<void> => {
  await BASE_API.delete(`/shepherds/${id}`);
};

export const approveShepherd = async (id: string): Promise<ShepherdRecord> => {
  const { data } = await BASE_API.post(`/shepherds/${id}/approve`);
  return data.data;
};

export const declineShepherd = async (id: string): Promise<void> => {
  await BASE_API.delete(`/shepherds/${id}/decline`);
};
