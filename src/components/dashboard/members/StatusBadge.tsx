// ─── Types

export type Status = "active" | "pending" | "inactive";

// ─── Config

const STATUS_STYLES: Record<
  Status,
  { dot: string; text: string; label: string; bg: string }
> = {
  active: {
    dot: "bg-green-500",
    text: "text-green-700",
    label: "Active",
    bg: "bg-green-50",
  },
  pending: {
    dot: "bg-amber-400",
    text: "text-amber-700",
    label: "Pending",
    bg: "bg-amber-100",
  },
  inactive: {
    dot: "bg-slate-300",
    text: "text-slate-500",
    label: "Inactive",
    bg: "bg-slate-100",
  },
};

// ─── Component

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const { dot, text, label } = STATUS_STYLES[status];
  return (
    <div
      className={`flex items-center gap-1.5 ${STATUS_STYLES[status].bg} px-2.5 py-1 rounded-full w-max`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className={`text-[11px] font-medium ${text}`}>{label}</span>
    </div>
  );
};

export default StatusBadge;
