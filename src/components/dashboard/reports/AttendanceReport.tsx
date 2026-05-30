import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import {
  Card,
  StatCard,
  SectionTitle,
  ChartTip,
  ExportBtn,
  BarRow,
} from "./ReportPrimitives";
import { rateBar } from "./report.helpers";
import { useAttendanceReport } from "@/hooks/queries/useReports";

export const AttendanceReport: React.FC = () => {
  const { data, isLoading } = useAttendanceReport();

  const total = data?.total ?? 0;
  const present = data?.present ?? 0;
  const absent = data?.absent ?? 0;
  const rate = data?.rate ?? 0;
  const trend = data?.trend ?? [];
  const byRegion = data?.byRegion ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Overall Rate"
          value={isLoading ? "—" : `${rate}%`}
          icon={<TrendingUp size={16} />}
          iconBg="bg-[#E6F1FB]"
          iconColor="text-[#185FA5]"
          valueColor="text-[#185FA5]"
        />
        <StatCard
          label="Total Sessions"
          value={isLoading ? "—" : total.toLocaleString()}
          icon={<CalendarCheck size={16} />}
          iconBg="bg-[#E6F1FB]"
          iconColor="text-[#185FA5]"
        />
        <StatCard
          label="Present Records"
          value={isLoading ? "—" : present.toLocaleString()}
          icon={<CheckCircle2 size={16} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          valueColor="text-green-700"
        />
        <StatCard
          label="Absent Records"
          value={isLoading ? "—" : absent.toLocaleString()}
          icon={<XCircle size={16} />}
          iconBg="bg-red-50"
          iconColor="text-red-400"
          valueColor="text-red-500"
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionTitle>Attendance Trend (6 weeks)</SectionTitle>
          <ExportBtn format="CSV" onClick={() => {}} />
        </div>
        {trend.length === 0 ? (
          <p className="text-[13px] text-slate-400 text-center py-10">
            No data yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={trend}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="at" x1="0" y1="0" x2="0" y2="1">
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
                domain={[40, 100]}
              />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="rate"
                name="Rate"
                stroke="#185FA5"
                strokeWidth={2}
                fill="url(#at)"
                dot={{ fill: "#185FA5", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#0C447C", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-6">
        <SectionTitle>Attendance Rate by Region</SectionTitle>
        {byRegion.length === 0 ? (
          <p className="text-[13px] text-slate-400">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {byRegion.map(({ region, rate: r }) => (
              <BarRow
                key={region}
                label={region}
                value={r}
                barColor={rateBar(r)}
                suffix="%"
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AttendanceReport;
