import React from "react";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
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
import { useRegionalBreakdown } from "@/hooks/queries/useDashboard";

interface TooltipItem {
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: ValueType; name?: NameType }>;
}

const BarTooltip = ({ active, payload, label }: TooltipItem) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm text-[12px]">
      <p className="font-medium text-slate-900">{label}</p>
      <p className="text-[#185FA5]">{payload[0].value} members</p>
    </div>
  );
};

const RegionalChart: React.FC = () => {
  const { data = [], isLoading } = useRegionalBreakdown();

  return (
    <Card className="p-6">
      <h2 className="text-[15px] font-semibold text-slate-900 mb-5">
        By Region
      </h2>
      {isLoading ? (
        <div className="h-55 flex items-center justify-center">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-55 flex items-center justify-center">
          <p className="text-[13px] text-slate-400 font-light">
            No regional data
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{ top: 18, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="region"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              tickFormatter={(v) => (v === "Greater Accra" ? "G. Accra" : v)}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BarTooltip />} />
            <Bar
              dataKey="members"
              fill="#E6F1FB"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default RegionalChart;
