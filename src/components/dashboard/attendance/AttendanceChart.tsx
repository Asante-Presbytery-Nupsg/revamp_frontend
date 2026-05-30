import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import type { UnionAttendance, Period } from "@/api/unionAttendance.api";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
  });

// ─── Aggregation ──────────────────────────────────────────────────────────────

const aggregateData = (
  data: UnionAttendance[],
  period: Period,
): { label: string; tooltip: string; Male: number; Female: number }[] => {
  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  if (period === "monthly") {
    // X-axis = date, tooltip = meeting type
    return sorted.map((r) => ({
      label: shortDate(r.date),
      tooltip: r.meeting,
      Male: r.male,
      Female: r.female,
    }));
  }

  if (period === "quarterly") {
    const map = new Map<
      string,
      { tooltip: string; Male: number; Female: number; order: number }
    >();
    sorted.forEach((r, idx) => {
      const d = new Date(r.date);
      const jan1 = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(
        ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
      );
      const key = `Wk ${weekNum}`;
      const existing = map.get(key);
      if (existing) {
        existing.Male += r.male;
        existing.Female += r.female;
      } else {
        map.set(key, {
          tooltip: key,
          Male: r.male,
          Female: r.female,
          order: idx,
        });
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1].order - b[1].order)
      .map(([label, { Male, Female, tooltip }]) => ({
        label,
        tooltip,
        Male,
        Female,
      }));
  }

  // Yearly — group by month
  const map = new Map<
    string,
    { tooltip: string; Male: number; Female: number; order: number }
  >();
  sorted.forEach((r, idx) => {
    const key = new Date(r.date).toLocaleDateString("en-GH", {
      month: "short",
    });
    const existing = map.get(key);
    if (existing) {
      existing.Male += r.male;
      existing.Female += r.female;
    } else {
      map.set(key, {
        tooltip: key,
        Male: r.male,
        Female: r.female,
        order: idx,
      });
    }
  });
  return Array.from(map.entries())
    .sort((a, b) => a[1].order - b[1].order)
    .map(([label, { Male, Female, tooltip }]) => ({
      label,
      tooltip,
      Male,
      Female,
    }));
};

// ─── Custom tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    color: string;
    payload: { tooltip: string };
  }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const tooltip = payload[0]?.payload?.tooltip;
  return (
    <div className="bg-white border border-slate-100 rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="font-medium text-slate-700 mb-1">{tooltip ?? label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

interface AttendanceChartProps {
  data?: UnionAttendance[];
  loading?: boolean;
  period?: Period;
}

const periodSubtitle: Record<Period, string> = {
  monthly: "per meeting · hover for type",
  quarterly: "grouped by week",
  yearly: "grouped by month",
};

const AttendanceChart = ({
  data = [],
  loading,
  period = "monthly",
}: AttendanceChartProps) => {
  const chartData = useMemo(() => aggregateData(data, period), [data, period]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 h-80 flex items-center justify-center">
        <Loader2 size={20} className="text-slate-300 animate-spin" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 h-80 flex items-center justify-center">
        <p className="text-[14px] text-slate-400 font-light">
          No attendance data for this period
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <div>
          <h3 className="text-[15px] font-medium text-slate-800">
            Attendance Trend
          </h3>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Male vs Female · {periodSubtitle[period]}
          </p>
        </div>
        <span className="text-[12px] text-slate-400 font-light">
          {chartData.length} {chartData.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="Male"
            fill="#0C447C"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
          <Bar
            dataKey="Female"
            fill="#f472b6"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
