import BASE_API from "./base.api";
import type { ApiResponse, PaginatedResult } from "@/types/api.types";

export interface Programme {
  id: string;
  name: string;
}

export interface ProgrammeQuery {
  search?: string;
  flat?: boolean;
  page?: number;
  limit?: number;
}

export const getProgrammesFlat = async (): Promise<Programme[]> => {
  const { data } = await BASE_API.get<ApiResponse<Programme[]>>("/programmes", {
    params: { flat: true },
  });
  return data.data;
};

export const getProgrammes = async (
  query: ProgrammeQuery = {},
): Promise<PaginatedResult<Programme>> => {
  const { data } = await BASE_API.get<
    { success: boolean } & PaginatedResult<Programme>
  >("/programmes", { params: query });
  return data;
};

export const getProgrammeById = async (id: string): Promise<Programme> => {
  const { data } = await BASE_API.get<ApiResponse<Programme>>(
    `/programmes/${id}`,
  );
  return data.data;
};

export const createProgramme = async (name: string): Promise<Programme> => {
  const { data } = await BASE_API.post<ApiResponse<Programme>>("/programmes", {
    name,
  });
  return data.data;
};

export const updateProgramme = async (
  id: string,
  name: string,
): Promise<Programme> => {
  const { data } = await BASE_API.patch<ApiResponse<Programme>>(
    `/programmes/${id}`,
    { name },
  );
  return data.data;
};

export const deleteProgramme = async (id: string): Promise<void> => {
  await BASE_API.delete(`/programmes/${id}`);
};
