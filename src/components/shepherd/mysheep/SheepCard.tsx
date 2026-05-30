import { ChevronRight } from "lucide-react";
import { ini, rateColor, rateBar, type Sheep } from "./sheepData";

// ─── Component ────────────────────────────────────────────────────────────────

export const SheepCard: React.FC<{ sheep: Sheep; onClick: () => void }> = ({
  sheep,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 cursor-pointer hover:border-slate-200 transition-all"
  >
    <div className="w-11 h-11 rounded-xl bg-[#E6F1FB] flex items-center justify-center text-[13px] font-bold text-[#185FA5] shrink-0">
      {ini(sheep.name)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-[14px] font-semibold text-slate-900 truncate">
          {sheep.name}
        </p>
        {sheep.attendanceRate < 70 && (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 shrink-0">
            Attention
          </span>
        )}
      </div>
      <p className="text-[12px] text-slate-400 truncate">
        {sheep.institution} · {sheep.programme}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-20">
          <div
            className={`h-full rounded-full ${rateBar(sheep.attendanceRate)}`}
            style={{ width: `${sheep.attendanceRate}%` }}
          />
        </div>
        <span
          className={`text-[11px] font-bold ${rateColor(sheep.attendanceRate)}`}
        >
          {sheep.attendanceRate}%
        </span>
        <span className="text-[10px] text-slate-400">· {sheep.lastSeen}</span>
      </div>
    </div>
    <ChevronRight size={15} className="text-slate-300 shrink-0" />
  </div>
);

export default SheepCard;
