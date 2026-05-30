// src/api/ministries.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export type MinistryStatus = "Active" | "Planning" | "Inactive";

export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  leadId: string | null;
  leadName: string | null;
  status: MinistryStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MinistryStats {
  total: number;
  active: number;
  planning: number;
  inactive: number;
}

export interface MinistryQuery {
  search?: string;
  status?: MinistryStatus;
  page?: number;
  limit?: number;
}

export interface CreateMinistryInput {
  name: string;
  description?: string;
  leadId?: string | null;
  leadName?: string;
  status: MinistryStatus;
  note?: string;
}

export type UpdateMinistryInput = Partial<CreateMinistryInput>;

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getMinistries = async (
  query: MinistryQuery = {},
): Promise<PaginatedResponse<Ministry>> => {
  const { data } = await BASE_API.get<PaginatedResponse<Ministry>>(
    "/ministries",
    { params: query },
  );
  return data;
};

export const getMinistriesFlat = async (): Promise<Ministry[]> => {
  const { data } = await BASE_API.get<ApiResponse<Ministry[]>>("/ministries", {
    params: { flat: true },
  });
  return data.data;
};

export const getMinistryById = async (id: string): Promise<Ministry> => {
  const { data } = await BASE_API.get<ApiResponse<Ministry>>(
    `/ministries/${id}`,
  );
  return data.data;
};

export const getMinistryStats = async (): Promise<MinistryStats> => {
  const { data } = await BASE_API.get<ApiResponse<MinistryStats>>(
    "/ministries/stats",
  );
  return data.data;
};

export const createMinistry = async (
  input: CreateMinistryInput,
): Promise<Ministry> => {
  const { data } = await BASE_API.post<ApiResponse<Ministry>>(
    "/ministries",
    input,
  );
  return data.data;
};

export const updateMinistry = async (
  id: string,
  input: UpdateMinistryInput,
): Promise<Ministry> => {
  const { data } = await BASE_API.patch<ApiResponse<Ministry>>(
    `/ministries/${id}`,
    input,
  );
  return data.data;
};

export const deleteMinistry = async (id: string): Promise<void> => {
  await BASE_API.delete(`/ministries/${id}`);
};
