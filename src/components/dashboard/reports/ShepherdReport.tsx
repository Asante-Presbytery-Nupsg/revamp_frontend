import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Shield, CheckCircle2, CalendarCheck } from "lucide-react";
import {
  Card,
  StatCard,
  SectionTitle,
  ChartTip,
  ExportBtn,
} from "./ReportPrimitives";
import { rateBar, rateColor } from "./report.helpers";
import { useShepherdReport } from "@/hooks/queries/useReports";
import { Pagination } from "@/components/shared/Pagination";

const TABLE_HEADERS = [
  "Shepherd",
  "Institution",
  "Sheep",
  "Sessions",
  "Avg Rate",
  "Last Active",
];

const CHART_TOP = 10;
const PAGE_SIZE = 10;

export const ShepherdReport: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading } = useShepherdReport(pageIndex + 1, PAGE_SIZE);

  const total = data?.total ?? 0;
  const active = data?.active ?? 0;
  const avgSessions = data?.avgSessionsPerMonth ?? 0;
  const performance = data?.data ?? [];
  const pagination = data?.pagination;
  const pageCount = pagination?.totalPages ?? 0;
  const totalFiltered = pagination?.total ?? 0;

  // ── Chart — top N of current page + note if more exist ─────────────────────
  const topChart = performance.slice(0, CHART_TOP);
  const rest = performance.slice(CHART_TOP);
  const othersTotal = rest.reduce((a, s) => a + s.sessions, 0);
  const chartData =
    rest.length > 0
      ? [...topChart, { name: "Others", sessions: othersTotal, rate: 0 }]
      : topChart;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Shepherds"
          value={isLoading ? "—" : total}
          icon={<Shield size={16} />}
          iconBg="bg-[#E6F1FB]"
          iconColor="text-[#185FA5]"
        />
        <StatCard
          label="Active"
          value={isLoading ? "—" : active}
          icon={<CheckCircle2 size={16} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          valueColor="text-green-700"
        />
        <StatCard
          label="Avg Sessions/Mo"
          value={isLoading ? "—" : avgSessions}
          icon={<CalendarCheck size={16} />}
          iconBg="bg-[#E6F1FB]"
          iconColor="text-[#185FA5]"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <SectionTitle>Shepherd Performance</SectionTitle>
          <ExportBtn format="CSV" onClick={() => {}} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-130">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[13px] text-slate-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : performance.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[13px] text-slate-400"
                  >
                    No shepherd data yet.
                  </td>
                </tr>
              ) : (
                performance.map((s) => (
                  <tr
                    key={s.name}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-[13px] font-medium text-slate-900">
                        {s.name}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[12px] text-slate-500">
                      {s.institution}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                      {s.sheep}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                      {s.sessions}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rateBar(s.rate)}`}
                            style={{ width: `${s.rate}%` }}
                          />
                        </div>
                        <span
                          className={`text-[12px] font-semibold ${rateColor(s.rate)}`}
                        >
                          {s.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[12px] text-slate-400">
                      {s.lastActive}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <Pagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={PAGE_SIZE}
            totalFiltered={totalFiltered}
            onPageChange={setPageIndex}
            onPageSizeChange={() => {}}
            pageSizeOptions={[]}
          />
        )}
      </Card>

      {/* Chart — top 10 of current page */}
      {performance.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Sessions per Shepherd</SectionTitle>
            {rest.length > 0 && (
              <p className="text-[11px] text-slate-400">
                Top {CHART_TOP} shown · {rest.length} grouped into "Others"
              </p>
            )}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.split(" ")[0]}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTip color="#45556c" />} />
              <Bar
                dataKey="sessions"
                name="Sessions"
                fill="#E6F1FB"
                radius={[4, 4, 0, 0]}
                label={{ position: "top", fontSize: 11, fill: "#94a3b8" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default ShepherdReport;
