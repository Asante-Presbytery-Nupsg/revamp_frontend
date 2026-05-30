// src/hooks/queries/useActivity.ts
import { useQuery } from "@tanstack/react-query";
import { getRecentActivity } from "@/api/activity.api";

export const useRecentActivity = (limit: number = 10) =>
  useQuery({
    queryKey: ["activity", "recent", limit],
    queryFn: () => getRecentActivity(limit),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60, // auto-refresh every minute
  });
