// src/api/shepherdOverview.api.ts
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export interface ShepherdSheepRow {
  id: string;
  name: string;
  institution: string | null;
  programme: string | null;
  phone: string | null;
  attendanceRate: number;
  lastSeen: string | null;
  status: "active" | "inactive";
}

export interface RecentSessionRow {
  date: string;
  present: number;
  absent: number;
  total: number;
}

export interface UpcomingEventRow {
  id: string;
  title: string;
  date: string;
  location: string;
}

export interface TrendPoint {
  week: string;
  rate: number;
}

export interface ShepherdOverviewData {
  stats: {
    sheepCount: number;
    avgAttendanceRate: number;
    sessionsThisMonth: number;
    needsAttention: number;
  };
  trend: TrendPoint[];
  sheep: ShepherdSheepRow[];
  recentSessions: RecentSessionRow[];
  upcomingEvents: UpcomingEventRow[];
}

export const getShepherdOverview = async (): Promise<ShepherdOverviewData> => {
  const { data } = await BASE_API.get<ApiResponse<ShepherdOverviewData>>(
    "/shepherds/overview",
  );
  return data.data;
};
