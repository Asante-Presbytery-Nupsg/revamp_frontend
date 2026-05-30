import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";
import type { PaginatedResult } from "@/types/api.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MembershipReport {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  pctVsLastMonth: number;
  growth: { month: string; members: number }[];
  byRegion: { region: string; count: number }[];
  byInstitution: { institution: string; count: number }[];
}

export interface AttendanceReport {
  total: number;
  present: number;
  absent: number;
  rate: number;
  trend: { week: string; rate: number }[];
  byRegion: { region: string; rate: number }[];
}

export interface ShepherdPerf {
  name: string;
  institution: string;
  sheep: number;
  sessions: number;
  rate: number;
  lastActive: string;
}

export interface ShepherdReportMeta {
  total: number;
  active: number;
  avgSessionsPerMonth: number;
}

// The API returns meta fields + PaginatedResult spread
export interface ShepherdReportResponse extends ShepherdReportMeta {
  data: ShepherdPerf[];
  pagination: PaginatedResult<ShepherdPerf>["pagination"];
}

export interface EventSummary {
  name: string;
  type: string;
  status: string;
  date: string;
  cap: number;
  registered: number;
}

export interface EventReport {
  total: number;
  totalRegistered: number;
  totalCap: number;
  overallFill: number;
  events: EventSummary[];
}

// ── Fetchers ──────────────────────────────────────────────────────────────────

export const getMembershipReport = async (): Promise<MembershipReport> => {
  const { data } = await BASE_API.get<ApiResponse<MembershipReport>>(
    "/reports/membership",
  );
  return data.data;
};

export const getAttendanceReport = async (): Promise<AttendanceReport> => {
  const { data } = await BASE_API.get<ApiResponse<AttendanceReport>>(
    "/reports/attendance",
  );
  return data.data;
};

export const getShepherdReport = async (
  page = 1,
  limit = 10,
): Promise<ShepherdReportResponse> => {
  const { data } = await BASE_API.get<ApiResponse<ShepherdReportResponse>>(
    "/reports/shepherds",
    { params: { page, limit } },
  );
  return data.data;
};

export const getEventReport = async (): Promise<EventReport> => {
  const { data } =
    await BASE_API.get<ApiResponse<EventReport>>("/reports/events");
  return data.data;
};
