import BASE_API from "./base.api";
import type { ApiResponse, PaginatedResult } from "@/types/api.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedbackCategory =
  | "general"
  | "shepherd"
  | "events"
  | "programme"
  | "facilities"
  | "suggestion";

export type FeedbackStatus = "received" | "reviewed" | "actioned";

export interface FeedbackItem {
  id: string;
  submittedById: string | null;
  targetId: string | null;
  category: FeedbackCategory;
  rating: number;
  message: string;
  anonymous: boolean;
  status: FeedbackStatus;
  adminNote: string | null;
  reviewedAt: string | null;
  actionedAt: string | null;
  createdAt: string;
  updatedAt: string;
  submitterName: string | null;
  targetName: string | null;
}

export interface FeedbackStats {
  total: number;
  avgRating: number;
  byStatus: Record<FeedbackStatus, number>;
  byCategory: Record<FeedbackCategory, number>;
}

export interface CreateFeedbackInput {
  category: FeedbackCategory;
  rating: number;
  message: string;
  anonymous: boolean;
}

export interface CreateShepherdFeedbackInput {
  category: FeedbackCategory;
  rating: number;
  message: string;
}

export interface UpdateFeedbackInput {
  status?: FeedbackStatus;
  adminNote?: string;
}

// ─── Sheep — submit & view own ────────────────────────────────────────────────

export const createFeedback = async (
  input: CreateFeedbackInput,
): Promise<FeedbackItem> => {
  const { data } = await BASE_API.post<ApiResponse<FeedbackItem>>(
    "/feedback",
    input,
  );
  return data.data;
};

export const getMyFeedback = async (
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedResult<FeedbackItem>> => {
  const { data } = await BASE_API.get<PaginatedResult<FeedbackItem>>(
    "/feedback/mine",
    { params },
  );
  return data;
};

// ─── Shepherd — submit on sheep & view own submissions ───────────────────────

export const createShepherdFeedback = async (
  sheepId: string,
  input: CreateShepherdFeedbackInput,
): Promise<FeedbackItem> => {
  const { data } = await BASE_API.post<ApiResponse<FeedbackItem>>(
    `/feedback/sheep/${sheepId}`,
    input,
  );
  return data.data;
};

export const getMyShepherdFeedback = async (
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedResult<FeedbackItem>> => {
  const { data } = await BASE_API.get<PaginatedResult<FeedbackItem>>(
    "/feedback/shepherd/mine",
    { params },
  );
  return data;
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllFeedback = async (params: {
  category?: FeedbackCategory;
  status?: FeedbackStatus;
  search?: string;
  targetId?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<FeedbackItem> & { avgRating: number }> => {
  const { data } = await BASE_API.get("/feedback", { params });
  return data;
};

export const getFeedbackStats = async (): Promise<FeedbackStats> => {
  const { data } =
    await BASE_API.get<ApiResponse<FeedbackStats>>("/feedback/stats");
  return data.data;
};

export const updateFeedback = async (
  id: string,
  input: UpdateFeedbackInput,
): Promise<FeedbackItem> => {
  const { data } = await BASE_API.patch<ApiResponse<FeedbackItem>>(
    `/feedback/${id}`,
    input,
  );
  return data.data;
};

export const deleteFeedback = async (id: string): Promise<void> => {
  await BASE_API.delete(`/feedback/${id}`);
};
