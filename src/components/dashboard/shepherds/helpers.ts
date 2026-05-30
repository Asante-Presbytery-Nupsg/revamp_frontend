import type { Sheep } from "./types";

export const avg = (sheep: Sheep[] | undefined) => {
  if (!sheep?.length) return 0;
  const rates = sheep.map((s) => Number(s.attendanceRate ?? 0));
  return Math.round(rates.reduce((a, r) => a + r, 0) / rates.length);
};

export const ini = (name: string) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

export const rateColor = (r: number) =>
  r >= 80 ? "text-green-600" : r >= 60 ? "text-amber-600" : "text-red-500";

export const rateBar = (r: number) =>
  r >= 80 ? "bg-green-500" : r >= 60 ? "bg-amber-400" : "bg-red-400";
