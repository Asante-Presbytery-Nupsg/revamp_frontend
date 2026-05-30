// src/api/institutions.api.ts
import BASE_API from "./base.api";
import type { ApiResponse, PaginatedResult } from "@/types/api.types";

export interface Institution {
  id: string;
  name: string;
  shortName: string | null;
  location: string | null;
  type: "University" | "Polytechnic" | "College" | null;
}

export interface InstitutionQuery {
  search?: string;
  type?: Institution["type"];
  flat?: boolean;
  page?: number;
  limit?: number;
}

export const getInstitutionsFlat = async (
  type?: Institution["type"],
): Promise<Institution[]> => {
  const { data } = await BASE_API.get<ApiResponse<Institution[]>>(
    "/institutions",
    {
      params: { flat: true, type },
    },
  );
  return data.data;
};

// ── paginated (for admin tables)
export const getInstitutions = async (
  query: InstitutionQuery = {},
): Promise<PaginatedResult<Institution>> => {
  const { data } = await BASE_API.get<
    { success: boolean } & PaginatedResult<Institution>
  >("/institutions", { params: { limit: 20, ...query } });
  return data;
};

export const getInstitutionById = async (id: string): Promise<Institution> => {
  const { data } = await BASE_API.get<ApiResponse<Institution>>(
    `/institutions/${id}`,
  );
  return data.data;
};

export const createInstitution = async (
  payload: Omit<Institution, "id">,
): Promise<Institution> => {
  const { data } = await BASE_API.post<ApiResponse<Institution>>(
    "/institutions",
    payload,
  );
  return data.data;
};

export const updateInstitution = async (
  id: string,
  payload: Partial<Omit<Institution, "id">>,
): Promise<Institution> => {
  const { data } = await BASE_API.patch<ApiResponse<Institution>>(
    `/institutions/${id}`,
    payload,
  );
  return data.data;
};

export const deleteInstitution = async (id: string): Promise<void> => {
  await BASE_API.delete(`/institutions/${id}`);
};
