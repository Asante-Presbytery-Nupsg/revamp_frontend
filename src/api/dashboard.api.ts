// src/api/dashboard.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export interface DashboardStats {
  totalMembers: number;
  totalShepherds: number;
  upcomingEvents: number;
  avgAttendance: number;
  membersChange: number;
  shepherdsChange: number;
  eventsChange: number;
  attendanceChange: number;
}

export interface AttendanceTrendPoint {
  week: string;
  attendance: number;
}

export interface RegionalBreakdown {
  region: string;
  members: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } =
    await BASE_API.get<ApiResponse<DashboardStats>>("/dashboard/stats");
  return data.data;
};

export const getAttendanceTrend = async (): Promise<AttendanceTrendPoint[]> => {
  const { data } = await BASE_API.get<ApiResponse<AttendanceTrendPoint[]>>(
    "/dashboard/attendance-trend",
  );
  return data.data;
};

export const getRegionalBreakdown = async (): Promise<RegionalBreakdown[]> => {
  const { data } = await BASE_API.get<ApiResponse<RegionalBreakdown[]>>(
    "/dashboard/regional-breakdown",
  );
  return data.data;
};
