// src/hooks/queries/usePrayerRequests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPrayerRequests,
  getPrayerRequestById,
  getPrayerStats,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
} from "@/api/prayerRequests.api";
import type {
  PrayerRequestQuery,
  CreatePrayerRequestInput,
  UpdatePrayerRequestInput,
} from "@/api/prayerRequests.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

const PR_KEY = "prayer-requests";

export const usePrayerRequests = (query: PrayerRequestQuery = {}) =>
  useQuery({
    queryKey: [PR_KEY, "list", query],
    queryFn: () => getPrayerRequests(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const usePrayerRequest = (id: string) =>
  useQuery({
    queryKey: [PR_KEY, "detail", id],
    queryFn: () => getPrayerRequestById(id),
    enabled: !!id,
  });

export const usePrayerStats = () =>
  useQuery({
    queryKey: [PR_KEY, "stats"],
    queryFn: getPrayerStats,
    staleTime: 1000 * 60,
  });

export const useCreatePrayerRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePrayerRequestInput) => createPrayerRequest(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PR_KEY] });
      toast.success("Prayer request submitted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to submit request")),
  });
};

export const useUpdatePrayerRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdatePrayerRequestInput;
    }) => updatePrayerRequest(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PR_KEY] });
      toast.success("Prayer request updated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to update")),
  });
};

export const useDeletePrayerRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePrayerRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PR_KEY] });
      toast.success("Prayer request deleted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to delete")),
  });
};
