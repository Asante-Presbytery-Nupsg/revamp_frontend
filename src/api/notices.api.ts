// src/api/notices.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export type NoticePriority = "normal" | "urgent";
export type NoticeTarget = "all" | "sheep" | "shepherd" | "admin";

export interface Notice {
  id: string;
  title: string;
  body: string;
  fromName: string;
  priority: NoticePriority;
  targetRole: NoticeTarget;
  shepherdId: string | null;
  createdAt: string;
  updatedAt: string;
  unread: boolean;
  dateLabel: string;
}

export interface NoticeQuery {
  search?: string;
  priority?: NoticePriority;
  page?: number;
  limit?: number;
}

export interface CreateNoticeInput {
  title: string;
  body: string;
  fromName: string;
  priority: NoticePriority;
  targetRole: NoticeTarget;
}

export type UpdateNoticeInput = Partial<CreateNoticeInput>;

interface NoticesResponse {
  success: boolean;
  data: Notice[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// User-facing — get notices they can see
export const getMyNotices = async (
  query: NoticeQuery = {},
): Promise<NoticesResponse> => {
  const { data } = await BASE_API.get<NoticesResponse>("/notices/me", {
    params: query,
  });
  return data;
};

// Shepherd — notices they created
export const getShepherdNotices = async (
  query: NoticeQuery = {},
): Promise<PaginatedResponse<Notice>> => {
  const { data } = await BASE_API.get<PaginatedResponse<Notice>>(
    "/notices/shepherd/mine",
    { params: query },
  );
  return data;
};

export const createNotice = async (
  input: CreateNoticeInput,
): Promise<Notice> => {
  const { data } = await BASE_API.post<ApiResponse<Notice>>("/notices", input);
  return data.data;
};

export const updateNotice = async (
  id: string,
  input: UpdateNoticeInput,
): Promise<Notice> => {
  const { data } = await BASE_API.patch<ApiResponse<Notice>>(
    `/notices/${id}`,
    input,
  );
  return data.data;
};

export const deleteNotice = async (id: string): Promise<void> => {
  await BASE_API.delete(`/notices/${id}`);
};

export const markNoticeRead = async (noticeId: string): Promise<void> => {
  await BASE_API.post(`/notices/${noticeId}/read`);
};

export const markAllNoticesRead = async (): Promise<void> => {
  await BASE_API.post("/notices/me/read-all");
};
