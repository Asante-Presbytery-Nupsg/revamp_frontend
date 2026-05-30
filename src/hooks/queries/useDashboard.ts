import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getAttendanceTrend,
  getRegionalBreakdown,
} from "@/api/dashboard.api";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60,
  });

export const useAttendanceTrend = () =>
  useQuery({
    queryKey: ["dashboard", "attendance-trend"],
    queryFn: getAttendanceTrend,
    staleTime: 1000 * 60,
  });

export const useRegionalBreakdown = () =>
  useQuery({
    queryKey: ["dashboard", "regional-breakdown"],
    queryFn: getRegionalBreakdown,
    staleTime: 1000 * 60 * 5,
  });
