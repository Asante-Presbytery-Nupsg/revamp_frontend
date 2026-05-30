import type { Institution } from "@/api/institutions.api";

export type Region = {
  id: string;
  name: string;
  presbyteries: Presbytery[];
};

export type Presbytery = {
  id: string;
  name: string;
  regionId: string;
};

export type { Institution } from "@/api/institutions.api";

export type Tab = "regions" | "institutions";

export const INST_TYPES = ["University", "Polytechnic", "College"] as const;

export const TYPE_BADGE: Record<NonNullable<Institution["type"]>, string> = {
  University: "bg-[#E6F1FB] text-[#185FA5]",
  Polytechnic: "bg-purple-50 text-purple-700",
  College: "bg-green-50 text-green-700",
};

export const inputCls =
  "w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-colors placeholder:text-slate-300";

export const uid = () => Math.random().toString(36).slice(2, 9);
