// ─── Types ────────────────────────────────────────────────────────────────────

export type Sheep = {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  programme: string;
  level: string;
  hostel: string;
  region: string;
  attendanceRate: number;
  sessionCount: number;
  lastSeen: string;
  status: "active" | "inactive";
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ini = (firstName: string) =>
  firstName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

export const rateColor = (r: number) =>
  r >= 80 ? "text-green-600" : r >= 60 ? "text-amber-600" : "text-red-500";

export const rateBar = (r: number) =>
  r >= 80 ? "bg-green-500" : r >= 60 ? "bg-amber-400" : "bg-red-400";

export const rateLabel = (r: number) =>
  r >= 80 ? "Excellent" : r >= 60 ? "Moderate" : "Needs attention";
