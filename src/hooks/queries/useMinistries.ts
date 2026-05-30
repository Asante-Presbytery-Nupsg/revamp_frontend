// src/hooks/queries/useMinistries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMinistries,
  getMinistriesFlat,
  getMinistryById,
  getMinistryStats,
  createMinistry,
  updateMinistry,
  deleteMinistry,
} from "@/api/ministries.api";
import type {
  MinistryQuery,
  CreateMinistryInput,
  UpdateMinistryInput,
} from "@/api/ministries.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

const M_KEY = "ministries";

export const useMinistries = (query: MinistryQuery = {}) =>
  useQuery({
    queryKey: [M_KEY, "list", query],
    queryFn: () => getMinistries(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useMinistriesFlat = () =>
  useQuery({
    queryKey: [M_KEY, "flat"],
    queryFn: getMinistriesFlat,
    staleTime: 1000 * 60 * 5,
  });

export const useMinistry = (id: string) =>
  useQuery({
    queryKey: [M_KEY, "detail", id],
    queryFn: () => getMinistryById(id),
    enabled: !!id,
  });

export const useMinistryStats = () =>
  useQuery({
    queryKey: [M_KEY, "stats"],
    queryFn: getMinistryStats,
    staleTime: 1000 * 60,
  });

export const useCreateMinistry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMinistryInput) => createMinistry(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [M_KEY] });
      toast.success("Ministry created");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to create ministry")),
  });
};

export const useUpdateMinistry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateMinistryInput;
    }) => updateMinistry(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [M_KEY] });
      toast.success("Ministry updated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to update ministry")),
  });
};

export const useDeleteMinistry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMinistry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [M_KEY] });
      toast.success("Ministry deleted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to delete ministry")),
  });
};
