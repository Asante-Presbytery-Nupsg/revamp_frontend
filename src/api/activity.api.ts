import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export type ActivityType = "attendance" | "prayer" | "ministry";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  text: string;
  timestamp: string;
}

export const getRecentActivity = async (
  limit: number = 10,
): Promise<ActivityItem[]> => {
  const { data } = await BASE_API.get<ApiResponse<ActivityItem[]>>(
    "/activity/recent",
    { params: { limit } },
  );
  return data.data;
};
