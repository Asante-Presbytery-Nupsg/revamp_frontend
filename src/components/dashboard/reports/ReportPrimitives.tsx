import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Download } from "lucide-react";

// ─── Tooltip type ─────────────────────────────────────────────────────────────

export interface TooltipItem {
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>
    {children}
  </div>
);

// ─── SectionTitle ─────────────────────────────────────────────────────────────

export const SectionTitle: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <h3 className="text-[14px] font-semibold text-slate-900 mb-4">{children}</h3>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  subUp?: boolean;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}> = ({
  label,
  value,
  sub,
  subUp,
  icon,
  iconBg,
  iconColor,
  valueColor = "text-[#0c0d0e]",
}) => (
  <Card className="p-5">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      {sub && (
        <span
          className={`text-[11px] font-medium flex items-center gap-0.5 ${subUp ? "text-green-600" : "text-red-400"}`}
        >
          {subUp ? <ArrowUp size={13} /> : <ArrowDown size={13} />} {sub}
        </span>
      )}
    </div>
    <p
      className={`font-serif text-[30px] font-light leading-none tracking-tight ${valueColor}`}
    >
      {value}
    </p>
    <p className="text-[12px] font-medium text-slate-400 mt-1.5">{label}</p>
  </Card>
);

// ─── ChartTip ─────────────────────────────────────────────────────────────────

export const ChartTip: React.FC<TooltipItem & { color?: string }> = ({
  active,
  payload,
  label,
  color,
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: color ?? p.color ?? "#185FA5" }}>
          {p.name}: {p.value}
          {typeof p.value === "number" &&
          p.value <= 100 &&
          (p.name?.includes("rate") || p.name?.includes("Rate"))
            ? "%"
            : ""}
        </p>
      ))}
    </div>
  );
};

// ─── ExportBtn ────────────────────────────────────────────────────────────────

export const ExportBtn: React.FC<{ format: string; onClick: () => void }> = ({
  format,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium
               text-slate-600 hover:bg-slate-50 hover:border-[#185FA5] hover:text-[#185FA5] transition-colors"
  >
    <Download size={11} /> {format}
  </button>
);

// ─── Horizontal bar row ───────────────────────────────────────────────────────

export const BarRow: React.FC<{
  label: string;
  value: number;
  total?: number;
  barColor?: string;
  suffix?: string;
}> = ({ label, value, total, barColor = "bg-[#185FA5]", suffix = "" }) => {
  const pct = total ? Math.round((value / total) * 100) : value;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] text-slate-700">{label}</span>
        <span className="text-[12px] font-semibold text-slate-900">
          {total ? (
            <>
              {value}{" "}
              <span className="text-slate-400 font-normal">({pct}%)</span>
            </>
          ) : (
            `${value}${suffix}`
          )}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
};
