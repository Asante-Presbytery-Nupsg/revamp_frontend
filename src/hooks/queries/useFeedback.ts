import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFeedback,
  createShepherdFeedback,
  getMyFeedback,
  getMyShepherdFeedback,
  getAllFeedback,
  getFeedbackStats,
  updateFeedback,
  deleteFeedback,
  type CreateFeedbackInput,
  type CreateShepherdFeedbackInput,
  type UpdateFeedbackInput,
  type FeedbackCategory,
  type FeedbackStatus,
} from "@/api/feedback.api";

const KEYS = {
  all: ["feedback", "all"] as const,
  stats: ["feedback", "stats"] as const,
  mine: ["feedback", "mine"] as const,
  shepherdMine: ["feedback", "shepherd-mine"] as const,
};

// ── Sheep ─────────────────────────────────────────────────────────────────────

export const useCreateFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFeedbackInput) => createFeedback(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.mine }),
  });
};

export const useMyFeedback = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: [...KEYS.mine, params],
    queryFn: () => getMyFeedback(params),
    staleTime: 1000 * 30,
  });

// ── Shepherd ──────────────────────────────────────────────────────────────────

export const useCreateShepherdFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sheepId,
      input,
    }: {
      sheepId: string;
      input: CreateShepherdFeedbackInput;
    }) => createShepherdFeedback(sheepId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.shepherdMine }),
  });
};

export const useMyShepherdFeedback = (
  params: { page?: number; limit?: number } = {},
) =>
  useQuery({
    queryKey: [...KEYS.shepherdMine, params],
    queryFn: () => getMyShepherdFeedback(params),
    staleTime: 1000 * 30,
  });

// ── Admin ─────────────────────────────────────────────────────────────────────

export const useAllFeedback = (
  params: {
    category?: FeedbackCategory;
    status?: FeedbackStatus;
    search?: string;
    targetId?: string;
    page?: number;
    limit?: number;
  } = {},
) =>
  useQuery({
    queryKey: [...KEYS.all, params],
    queryFn: () => getAllFeedback(params),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useFeedbackStats = () =>
  useQuery({
    queryKey: KEYS.stats,
    queryFn: getFeedbackStats,
    staleTime: 1000 * 60 * 5,
  });

export const useUpdateFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFeedbackInput }) =>
      updateFeedback(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: KEYS.stats });
    },
  });
};

export const useDeleteFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeedback(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: KEYS.stats });
    },
  });
};
