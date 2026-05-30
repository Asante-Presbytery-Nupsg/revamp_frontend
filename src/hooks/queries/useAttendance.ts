// src/hooks/queries/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getAttendance,
  getAttendanceGrouped,
  getAttendanceById,
  getAttendanceStats,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getMyAttendanceHistory,
} from "@/api/attendance.api";
import type {
  AttendanceQuery,
  CreateAttendanceInput,
  UpdateAttendanceInput,
  GroupedAttendanceQuery,
  MyHistoryQuery,
} from "@/api/attendance.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

// ── queries ───────────────────────────────────────────────────────────────────

export const useAttendance = (query: AttendanceQuery = {}) =>
  useQuery({
    queryKey: queryKeys.attendance.all(query),
    queryFn: () => getAttendance(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useAttendanceGrouped = (query: GroupedAttendanceQuery = {}) =>
  useQuery({
    queryKey: queryKeys.attendance.grouped(query),
    queryFn: () => getAttendanceGrouped(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useAttendanceRecord = (id: string) =>
  useQuery({
    queryKey: queryKeys.attendance.detail(id),
    queryFn: () => getAttendanceById(id),
    enabled: !!id,
  });

export const useAttendanceStats = (
  params: { shepherdId?: string; from?: string; to?: string } = {},
) =>
  useQuery({
    queryKey: queryKeys.attendance.stats(params),
    queryFn: () => getAttendanceStats(params),
    staleTime: 1000 * 60,
  });

// ── mutations ─────────────────────────────────────────────────────────────────

export const useCreateAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAttendanceInput) => createAttendance(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.attendance.all() });
      qc.invalidateQueries({ queryKey: queryKeys.attendance.grouped() });
      qc.invalidateQueries({ queryKey: queryKeys.attendance.stats() });
      toast.success("Attendance recorded");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to record attendance")),
  });
};

export const useUpdateAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAttendanceInput }) =>
      updateAttendance(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.attendance.all() });
      qc.invalidateQueries({ queryKey: queryKeys.attendance.grouped() });
      qc.invalidateQueries({ queryKey: queryKeys.attendance.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.attendance.stats() });
      toast.success("Attendance updated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to update attendance")),
  });
};

export const useDeleteAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAttendance(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.attendance.all() });
      qc.invalidateQueries({ queryKey: queryKeys.attendance.grouped() });
      qc.invalidateQueries({ queryKey: queryKeys.attendance.stats() });
      toast.success("Attendance record deleted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to delete attendance")),
  });
};

export const useMyAttendanceHistory = (query: MyHistoryQuery = {}) =>
  useQuery({
    queryKey: ["attendance", "my-history", query],
    queryFn: () => getMyAttendanceHistory(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
