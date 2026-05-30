import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getShepherds,
  getShepherdById,
  getShepherdStats,
  getPendingShepherds,
  getMySheep,
  createShepherd,
  updateShepherd,
  activateShepherd,
  deactivateShepherd,
  deleteShepherd,
} from "@/api/shepherd.api";
import type {
  ShepherdQuery,
  CreateShepherdInput,
  UpdateShepherdInput,
} from "@/api/shepherd.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

// ── Queries ───────────────────────────────────────────────────────────────────

export const useShepherds = (query: ShepherdQuery = {}) =>
  useQuery({
    queryKey: queryKeys.shepherds.all(query),
    queryFn: () => getShepherds(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useShepherd = (id: string) =>
  useQuery({
    queryKey: queryKeys.shepherds.detail(id),
    queryFn: () => getShepherdById(id),
    enabled: !!id,
  });

export const useShepherdStats = () =>
  useQuery({
    queryKey: queryKeys.shepherds.stats(),
    queryFn: () => getShepherdStats(),
    staleTime: 1000 * 60,
  });

export const usePendingShepherds = () =>
  useQuery({
    queryKey: queryKeys.shepherds.pending(),
    queryFn: () => getPendingShepherds(),
    staleTime: 1000 * 30,
  });

export const useMySheep = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: queryKeys.shepherds.mySheep(params),
    queryFn: () => getMySheep(params),
    staleTime: 1000 * 30,
  });

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateShepherd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateShepherdInput) => createShepherd(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.all() });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.stats() });
      toast.success("Shepherd created");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to create shepherd")),
  });
};

export const useUpdateShepherd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateShepherdInput }) =>
      updateShepherd(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.all() });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.detail(id) });
      toast.success("Shepherd updated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to update shepherd")),
  });
};

export const useActivateShepherd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activateShepherd(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.all() });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.pending() });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.stats() });
      toast.success("Shepherd activated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to activate shepherd")),
  });
};

export const useDeactivateShepherd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateShepherd(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.all() });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.pending() });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.stats() });
      toast.success("Shepherd deactivated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to deactivate shepherd")),
  });
};

export const useDeleteShepherd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShepherd(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.all() });
      qc.invalidateQueries({ queryKey: queryKeys.shepherds.stats() });
      toast.success("Shepherd deleted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to delete shepherd")),
  });
};

// ── Toggle helper (used by the table's deactivate button) ─────────────────────

export const useToggleShepherdStatus = () => {
  const activate = useActivateShepherd();
  const deactivate = useDeactivateShepherd();

  return {
    toggle: (id: string, currentStatus: "active" | "inactive") =>
      currentStatus === "active" ? deactivate.mutate(id) : activate.mutate(id),
    isPending: activate.isPending || deactivate.isPending,
  };
};
