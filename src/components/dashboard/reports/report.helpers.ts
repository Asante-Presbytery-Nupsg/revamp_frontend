export const rateColor = (r: number) =>
  r >= 80 ? "text-green-600" : r >= 60 ? "text-amber-600" : "text-red-500";

export const rateBar = (r: number) =>
  r >= 80 ? "bg-green-500" : r >= 60 ? "bg-amber-400" : "bg-red-400";
