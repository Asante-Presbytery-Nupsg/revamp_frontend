// src/api/prayerRequests.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export type PrayerPriority = "Urgent" | "Normal";
export type PrayerStatus = "Open" | "In Progress" | "Resolved";
export type PrayerCategory =
  | "Health"
  | "Family"
  | "Academic"
  | "Career"
  | "Spiritual"
  | "Financial"
  | "Other";

export interface PrayerRequest {
  id: string;
  submittedById: string;
  submittedByName: string | null;
  title: string;
  description: string | null;
  category: PrayerCategory;
  priority: PrayerPriority;
  status: PrayerStatus;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
}

export interface PrayerRequestQuery {
  search?: string;
  status?: PrayerStatus;
  priority?: PrayerPriority;
  category?: PrayerCategory;
  submittedById?: string;
  page?: number;
  limit?: number;
}

export interface CreatePrayerRequestInput {
  title: string;
  description?: string;
  category: PrayerCategory;
  priority: PrayerPriority;
  status?: PrayerStatus;
}

export type UpdatePrayerRequestInput = Partial<CreatePrayerRequestInput>;

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getPrayerRequests = async (
  query: PrayerRequestQuery = {},
): Promise<PaginatedResponse<PrayerRequest>> => {
  const { data } = await BASE_API.get<PaginatedResponse<PrayerRequest>>(
    "/prayer-requests",
    { params: query },
  );
  return data;
};

export const getPrayerRequestById = async (
  id: string,
): Promise<PrayerRequest> => {
  const { data } = await BASE_API.get<ApiResponse<PrayerRequest>>(
    `/prayer-requests/${id}`,
  );
  return data.data;
};

export const getPrayerStats = async (): Promise<PrayerStats> => {
  const { data } = await BASE_API.get<ApiResponse<PrayerStats>>(
    "/prayer-requests/stats",
  );
  return data.data;
};

export const createPrayerRequest = async (
  input: CreatePrayerRequestInput,
): Promise<PrayerRequest> => {
  const { data } = await BASE_API.post<ApiResponse<PrayerRequest>>(
    "/prayer-requests",
    input,
  );
  return data.data;
};

export const updatePrayerRequest = async (
  id: string,
  input: UpdatePrayerRequestInput,
): Promise<PrayerRequest> => {
  const { data } = await BASE_API.patch<ApiResponse<PrayerRequest>>(
    `/prayer-requests/${id}`,
    input,
  );
  return data.data;
};

export const deletePrayerRequest = async (id: string): Promise<void> => {
  await BASE_API.delete(`/prayer-requests/${id}`);
};
