// src/hooks/queries/useNotices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotices,
  getShepherdNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  markNoticeRead,
  markAllNoticesRead,
} from "@/api/notices.api";
import type {
  NoticeQuery,
  CreateNoticeInput,
  UpdateNoticeInput,
} from "@/api/notices.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const N_KEY = "notices";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

export const useNotices = (query: NoticeQuery = {}) =>
  useQuery({
    queryKey: [N_KEY, "me", query],
    queryFn: () => getMyNotices(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useShepherdNotices = (query: NoticeQuery = {}) =>
  useQuery({
    queryKey: [N_KEY, "shepherd-mine", query],
    queryFn: () => getShepherdNotices(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useCreateNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateNoticeInput) => createNotice(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [N_KEY] });
      toast.success("Notice sent");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to send notice")),
  });
};

export const useUpdateNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoticeInput }) =>
      updateNotice(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [N_KEY] });
      toast.success("Notice updated");
    },
    onError: (error) => toast.error(extractError(error, "Failed to update")),
  });
};

export const useDeleteNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [N_KEY] });
      toast.success("Notice deleted");
    },
    onError: (error) => toast.error(extractError(error, "Failed to delete")),
  });
};

export const useMarkNoticeRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noticeId: string) => markNoticeRead(noticeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [N_KEY] });
    },
  });
};

export const useMarkAllNoticesRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNoticesRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [N_KEY] });
    },
  });
};
