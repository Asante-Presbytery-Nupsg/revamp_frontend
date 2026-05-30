import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export type InviteStatus = "pending" | "used" | "expired" | "revoked";

export interface Invite {
  id: string;
  token: string;
  email: string;
  sentBy: string;
  status: InviteStatus;
  expiresAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface InviteQuery {
  search?: string;
  status?: InviteStatus;
  sentBy?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getInvites = async (
  query: InviteQuery = {},
): Promise<PaginatedResponse<Invite>> => {
  const { data } = await BASE_API.get<PaginatedResponse<Invite>>("/invites", {
    params: query,
  });
  return data;
};

export const getInviteById = async (id: string): Promise<Invite> => {
  const { data } = await BASE_API.get<ApiResponse<Invite>>(`/invites/${id}`);
  return data.data;
};

export const getInviteByToken = async (token: string): Promise<Invite> => {
  const { data } = await BASE_API.get<ApiResponse<Invite>>(
    `/invites/token/${token}`,
  );
  return data.data;
};

export const sendInvite = async (email: string): Promise<Invite> => {
  const { data } = await BASE_API.post<ApiResponse<Invite>>("/invites", {
    email,
  });
  return data.data;
};

export const acceptInvite = async (token: string): Promise<Invite> => {
  const { data } = await BASE_API.post<ApiResponse<Invite>>(
    `/invites/accept/${token}`,
  );
  return data.data;
};

export const revokeInvite = async (id: string): Promise<Invite> => {
  const { data } = await BASE_API.patch<ApiResponse<Invite>>(
    `/invites/${id}/revoke`,
  );
  return data.data;
};

export const resendInvite = async (id: string): Promise<Invite> => {
  const { data } = await BASE_API.post<ApiResponse<Invite>>(
    `/invites/${id}/resend`,
  );
  return data.data;
};

export const deleteInvite = async (id: string): Promise<void> => {
  await BASE_API.delete(`/invites/${id}`);
};
