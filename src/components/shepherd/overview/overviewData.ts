// ─── Types ────────────────────────────────────────────────────────────────────

export type OverviewSheep = {
  id: string;
  name: string;
  institution: string;
  programme: string;
  level: string;
  phone: string;
  attendanceRate: number;
  lastSeen: string;
  status: "active" | "inactive";
};

export interface TooltipItem {
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
}

export const ini = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

export const rateColor = (r: number) =>
  r >= 80 ? "text-green-600" : r >= 60 ? "text-amber-600" : "text-red-500";

export const rateBar = (r: number) =>
  r >= 80 ? "bg-green-500" : r >= 60 ? "bg-amber-400" : "bg-red-400";
