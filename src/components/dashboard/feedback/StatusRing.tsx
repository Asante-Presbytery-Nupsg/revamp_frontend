import { STATUS_CONFIG, STATUS_OPTIONS } from "./feedback.config";

const StatusRing: React.FC<{
  byStatus: Record<string, number> | undefined;
  total: number;
}> = ({ byStatus, total }) => {
  if (!byStatus || total === 0) return null;

  const segments = [
    {
      key: "received",
      pct: ((byStatus.received ?? 0) / total) * 100,
      color: "bg-slate-400",
    },
    {
      key: "reviewed",
      pct: ((byStatus.reviewed ?? 0) / total) * 100,
      color: "bg-[#185FA5]",
    },
    {
      key: "actioned",
      pct: ((byStatus.actioned ?? 0) / total) * 100,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* Stacked bar */}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
        {segments.map(
          (s) =>
            s.pct > 0 && (
              <div
                key={s.key}
                className={`${s.color} transition-all duration-500`}
                style={{ width: `${s.pct}%` }}
              />
            ),
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {STATUS_OPTIONS.map((s) => {
          const style = STATUS_CONFIG[s];
          const count = byStatus?.[s] ?? 0;
          return (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  s === "received"
                    ? "bg-slate-400"
                    : s === "reviewed"
                      ? "bg-[#185FA5]"
                      : "bg-green-500"
                }`}
              />
              <span className="text-[11px] text-slate-500">
                {style.label}{" "}
                <span className="font-semibold text-slate-700">{count}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusRing;
