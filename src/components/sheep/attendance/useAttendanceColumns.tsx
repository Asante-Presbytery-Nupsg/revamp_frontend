import { createColumnHelper } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";
import type { MyHistoryRow } from "@/api/attendance.api";

const col = createColumnHelper<MyHistoryRow>();

const formatDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const useAttendanceColumns = () => [
  col.accessor("date", {
    header: "Date",
    cell: (info) => (
      <span className="text-[13px] font-medium text-slate-900">
        {formatDate(info.getValue())}
      </span>
    ),
  }),
  col.accessor("status", {
    header: "Status",
    cell: (info) => (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
          ${info.getValue() === "present" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}
      >
        {info.getValue() === "present" ? (
          <CheckCircle2 size={11} />
        ) : (
          <XCircle size={11} />
        )}
        {info.getValue() === "present" ? "Present" : "Absent"}
      </div>
    ),
  }),
  col.accessor("markedBy", {
    header: "Marked by",
    cell: (info) => (
      <span className="text-[13px] text-slate-600">{info.getValue()}</span>
    ),
  }),
  col.accessor("notes", {
    header: "Notes",
    cell: (info) => (
      <span
        className={`text-[12px] ${info.getValue() ? "text-slate-500" : "text-slate-300 italic"}`}
      >
        {info.getValue() || "—"}
      </span>
    ),
  }),
];
