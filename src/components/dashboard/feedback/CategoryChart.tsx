import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FeedbackCategory } from "@/api/feedback.api";

const CATEGORY_OPTIONS: FeedbackCategory[] = [
  "general",
  "shepherd",
  "events",
  "programme",
  "attendance",
  "engagement",
  "spiritual_growth",
  "conduct",
  "facilities",
  "suggestion",
];

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  general: "General",
  shepherd: "Shepherd",
  events: "Events",
  programme: "Programme",
  attendance: "Attendance",
  engagement: "Engagement",
  spiritual_growth: "Spiritual Growth",
  conduct: "Conduct",
  facilities: "Facilities",
  suggestion: "Suggestion",
};

const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  general: "#0C447C",
  shepherd: "#185FA5",
  events: "#2B7FD4",
  programme: "#10b981",
  attendance: "#8b5cf6",
  engagement: "#f59e0b",
  spiritual_growth: "#10b981",
  conduct: "#ef4444",
  facilities: "#f59e0b",
  suggestion: "#8b5cf6",
};

const BAR_WIDTH = 40;
const BAR_GAP = 16;
const Y_AXIS_WIDTH = 28;

export const CategoryChart: React.FC<{
  data: Record<string, number> | undefined;
}> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return CATEGORY_OPTIONS.map((c) => ({
      name: CATEGORY_LABELS[c],
      key: c,
      count: data[c] ?? 0,
      fill: CATEGORY_COLORS[c],
    })).sort((a, b) => b.count - a.count);
  }, [data]);

  if (chartData.length === 0 || chartData.every((d) => d.count === 0)) {
    return (
      <div className="h-50 flex items-center justify-center">
        <p className="text-[13px] text-slate-400 font-light">
          No data to display
        </p>
      </div>
    );
  }

  // Total scroll width = Y-axis + bars
  const scrollWidth = Y_AXIS_WIDTH + chartData.length * (BAR_WIDTH + BAR_GAP);

  return (
    <div className="relative">
      {/* Desktop — responsive, no scroll */}
      <div className="hidden sm:block ">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
            barCategoryGap="16%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={40}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
              formatter={(value) => [value?.toString(), "Count"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={32}>
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile — fixed-width inner chart, outer scrolls */}
      <div
        className="sm:hidden overflow-x-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`.cat-chart-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div
          className="cat-chart-scroll"
          style={{ width: scrollWidth, minWidth: "100%" }}
        >
          <BarChart
            width="100%"
            height={200}
            data={chartData}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
            barCategoryGap="16%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              allowDecimals={false}
              width={Y_AXIS_WIDTH}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
              formatter={(value) => [value?.toString(), "Count"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={BAR_WIDTH}>
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </div>

        {/* Fade-right hint that content continues */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8"
          style={{
            background: "linear-gradient(to left, white, transparent)",
          }}
        />
      </div>
    </div>
  );
};
