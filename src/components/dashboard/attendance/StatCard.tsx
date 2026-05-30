import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  bg: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
  bg,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div
      className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}
    >
      {icon}
    </div>
    <p
      className={`font-serif text-[30px] font-light leading-none tracking-tight ${color}`}
    >
      {value}
    </p>
    <p className="text-[11px] font-medium text-slate-400 mt-1.5">{label}</p>
  </div>
);

export default StatCard;
