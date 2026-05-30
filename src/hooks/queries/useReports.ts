import { useQuery } from "@tanstack/react-query";
import {
  getMembershipReport,
  getAttendanceReport,
  getShepherdReport,
  getEventReport,
} from "@/api/report.api";

const STALE = 1000 * 60 * 5;

export const useMembershipReport = () =>
  useQuery({
    queryKey: ["reports", "membership"],
    queryFn: getMembershipReport,
    staleTime: STALE,
  });

export const useAttendanceReport = () =>
  useQuery({
    queryKey: ["reports", "attendance"],
    queryFn: getAttendanceReport,
    staleTime: STALE,
  });

export const useShepherdReport = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["reports", "shepherds", page, limit],
    queryFn: () => getShepherdReport(page, limit),
    staleTime: STALE,
    placeholderData: (prev) => prev,
  });

export const useEventReport = () =>
  useQuery({
    queryKey: ["reports", "events"],
    queryFn: getEventReport,
    staleTime: STALE,
  });
