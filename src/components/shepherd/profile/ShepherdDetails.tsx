import { useShepherdProfile } from "@/hooks/queries/useShepherdProfile";

const fmt = (iso: string | null | undefined) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Generates a readable ID from uuid: SH-XXXX (last 4 chars uppercased)
const fmtId = (id: string | undefined) =>
  id ? `SH-${id.slice(-8, -4).toUpperCase()}` : "—";

export const ShepherdDetails: React.FC = () => {
  const { data, isLoading } = useShepherdProfile();

  const ROWS = [
    {
      label: "Shepherd since",
      value: fmt(data?.profileCreatedAt),
    },
    {
      label: "Shepherd ID",
      value: fmtId(data?.id),
    },
    {
      label: "Region",
      value: data?.region ?? "—",
    },
    {
      label: "Status",
      value: data?.isActive ? "Active" : "Inactive",
      highlight: data?.isActive,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <p className="text-[13px] font-semibold text-slate-900 mb-4">
        Shepherd Details
      </p>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex justify-between py-2.5 border-b border-slate-50 last:border-0"
            >
              <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {ROWS.map(({ label, value, highlight }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
            >
              <span className="text-[12px] text-slate-400">{label}</span>
              <span
                className={`text-[13px] font-medium ${
                  highlight ? "text-green-600" : "text-slate-900"
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShepherdDetails;
