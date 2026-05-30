import React from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import Card from "./Card";
import { useAttendanceTrend } from "@/hooks/queries/useDashboard";

interface TooltipItem {
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: ValueType; name?: NameType }>;
}

const CustomTooltip = ({ active, payload, label }: TooltipItem) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm text-[12px]">
      <p className="font-medium text-slate-900">{label}</p>
      <p className="text-[#185FA5]">{payload[0].value} attendees</p>
    </div>
  );
};

const AttendanceChart: React.FC = () => {
  const { data = [], isLoading } = useAttendanceTrend();

  return (
    <Card className="xl:col-span-2 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-slate-900">
          Attendance Trend
        </h2>
        <button className="text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2 flex items-center gap-1">
          View full report <ArrowUpRight size={13} />
        </button>
      </div>
      {isLoading ? (
        <div className="h-55 flex items-center justify-center">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#185FA5" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#185FA5"
              strokeWidth={2}
              fill="url(#attendanceGrad)"
              dot={{ fill: "#185FA5", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#0C447C", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default AttendanceChart;
