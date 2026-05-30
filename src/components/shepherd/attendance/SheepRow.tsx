import { CheckCircle2, XCircle } from "lucide-react";
import {
  type Sheep,
  type AttendanceStatus,
  ini,
} from "../attendance/attendanceData";

// ─── Component ────────────────────────────────────────────────────────────────

export const SheepRow: React.FC<{
  sheep: Sheep;
  status: AttendanceStatus;
  isLast: boolean;
  onToggle: () => void;
}> = ({ sheep, status, isLast, onToggle }) => (
  <div
    className={`flex items-center justify-between gap-4 px-4 sm:px-5 py-4 transition-colors
      ${!isLast ? "border-b border-slate-50" : ""}
      ${status === "present" ? "bg-green-50/50" : status === "absent" ? "bg-red-50/40" : "hover:bg-slate-50/60"}
    `}
  >
    {/* Avatar + info */}
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
        ${status === "present" ? "bg-green-100" : status === "absent" ? "bg-red-100" : "bg-[#E6F1FB]"}`}
      >
        <span
          className={`text-[11px] font-semibold transition-colors
          ${status === "present" ? "text-green-700" : status === "absent" ? "text-red-500" : "text-[#185FA5]"}`}
        >
          {ini(sheep.name)}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-slate-900 truncate">
          {sheep.name}
        </p>
        <p className="text-[11px] text-slate-400 truncate">
          {sheep.institution} · {sheep.programme}
        </p>
      </div>
    </div>

    {/* Toggle button */}
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-[12px] font-semibold transition-all shrink-0 border
        ${
          status === "present"
            ? "bg-green-500 border-green-500 text-white"
            : status === "absent"
              ? "bg-red-400 border-red-400 text-white"
              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
        }`}
    >
      {status === "present" ? (
        <>
          <CheckCircle2 size={13} /> Present
        </>
      ) : status === "absent" ? (
        <>
          <XCircle size={13} /> Absent
        </>
      ) : (
        <>
          <span className="w-3 h-3 rounded-full border-2 border-slate-300" />{" "}
          Mark
        </>
      )}
    </button>
  </div>
);

export default SheepRow;
