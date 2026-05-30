// src/hooks/queries/useUnionAttendance.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUnionAttendance,
  getUnionAttendanceById,
  getUnionAttendanceStats,
  createUnionAttendance,
  updateUnionAttendance,
  deleteUnionAttendance,
} from "@/api/unionAttendance.api";
import type {
  UnionAttendanceQuery,
  CreateUnionAttendanceInput,
  UpdateUnionAttendanceInput,
  Period,
} from "@/api/unionAttendance.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

const UA_KEY = "union-attendance";

export const useUnionAttendance = (query: UnionAttendanceQuery = {}) =>
  useQuery({
    queryKey: [UA_KEY, "list", query],
    queryFn: () => getUnionAttendance(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useUnionAttendanceRecord = (id: string) =>
  useQuery({
    queryKey: [UA_KEY, "detail", id],
    queryFn: () => getUnionAttendanceById(id),
    enabled: !!id,
  });

export const useUnionAttendanceStats = (period: Period = "monthly") =>
  useQuery({
    queryKey: [UA_KEY, "stats", period],
    queryFn: () => getUnionAttendanceStats(period),
    staleTime: 1000 * 60,
  });

export const useCreateUnionAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUnionAttendanceInput) =>
      createUnionAttendance(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [UA_KEY] });
      toast.success("Attendance recorded");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to record attendance")),
  });
};

export const useUpdateUnionAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUnionAttendanceInput;
    }) => updateUnionAttendance(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [UA_KEY] });
      toast.success("Attendance updated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to update attendance")),
  });
};

export const useDeleteUnionAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUnionAttendance(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [UA_KEY] });
      toast.success("Attendance record deleted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to delete")),
  });
};
