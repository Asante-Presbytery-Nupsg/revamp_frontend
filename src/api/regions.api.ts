// src/api/regions.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export interface Presbytery {
  id: string;
  name: string;
  regionId: string;
}

export interface Region {
  id: string;
  name: string;
  presbyteries: Presbytery[];
}

export const getRegionsFlat = async (): Promise<Region[]> => {
  const { data } = await BASE_API.get<ApiResponse<Region[]>>("/regions", {
    params: { flat: true },
  });
  return data.data;
};

export const getRegions = async (
  query: {
    search?: string;
    flat?: boolean;
    page?: number;
    limit?: number;
  } = {},
): Promise<{ success: boolean } & { data: Region[]; total: number }> => {
  const { data } = await BASE_API.get<
    { success: boolean } & { data: Region[]; total: number }
  >("/regions", { params: query });
  return data;
};

export const getRegionById = async (id: string): Promise<Region> => {
  const { data } = await BASE_API.get<ApiResponse<Region>>(`/regions/${id}`);
  return data.data;
};

export const getPresbyteriesByRegion = async (
  regionId: string,
): Promise<Presbytery[]> => {
  const { data } = await BASE_API.get<ApiResponse<Presbytery[]>>(
    `/regions/${regionId}/presbyteries`,
  );
  return data.data;
};

export const createRegion = async (name: string): Promise<Region> => {
  const { data } = await BASE_API.post<ApiResponse<Region>>("/regions", {
    name,
  });
  return data.data;
};

export const updateRegion = async (
  id: string,
  name: string,
): Promise<Region> => {
  const { data } = await BASE_API.patch<ApiResponse<Region>>(`/regions/${id}`, {
    name,
  });
  return data.data;
};

export const deleteRegion = async (id: string): Promise<void> => {
  await BASE_API.delete(`/regions/${id}`);
};

export const createPresbytery = async (
  regionId: string,
  name: string,
): Promise<Presbytery> => {
  const { data } = await BASE_API.post<ApiResponse<Presbytery>>(
    `/regions/${regionId}/presbyteries`,
    { name },
  );
  return data.data;
};

export const updatePresbytery = async (
  id: string,
  name: string,
): Promise<Presbytery> => {
  const { data } = await BASE_API.patch<ApiResponse<Presbytery>>(
    `/regions/presbyteries/${id}`,
    { name },
  );
  return data.data;
};

export const deletePresbytery = async (id: string): Promise<void> => {
  await BASE_API.delete(`/regions/presbyteries/${id}`);
};
