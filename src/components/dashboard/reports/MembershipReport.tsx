import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, CheckCircle2, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  StatCard,
  SectionTitle,
  ChartTip,
  ExportBtn,
  BarRow,
} from "./ReportPrimitives";
import { useMembershipReport } from "@/hooks/queries/useReports";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

const TOP_N = 10;

// ─── Full breakdown modal ─────────────────────────────────────────────────────

const BreakdownModal: React.FC<{
  title: string;
  allItems: { label: string; value: number }[];
  total: number;
  onClose: () => void;
}> = ({ title, allItems, total, onClose }) => {
  // Top N + Others bucket
  const top = allItems.slice(0, TOP_N);
  const rest = allItems.slice(TOP_N);
  const othersTotal = rest.reduce((a, i) => a + i.value, 0);
  const chartData =
    rest.length > 0 ? [...top, { label: "Others", value: othersTotal }] : top;

  return (
    <div className="fixed backdrop-blur-sm w-full h-full inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-serif font-light text-[#0c0d0e] text-[20px] tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Chart */}
        <div className="px-6 pt-5 pb-2">
          <ResponsiveContainer
            width="100%"
            height={Math.max(200, chartData.length * 36)}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: -56, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={130}
                tick={{ fontSize: 11, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) =>
                  v.length > 18 ? v.slice(0, 18) + "…" : v
                }
              />
              <Tooltip
                formatter={(value: ValueType | undefined) => {
                  if (value === undefined) return ["0", "Members"];
                  const n = Number(value);
                  const percentage =
                    total > 0 ? Math.round((n / total) * 100) : 0;

                  return [`${n} (${percentage}%)`, "Members"] as [
                    string,
                    string,
                  ];
                }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar
                dataKey="value"
                name="Members"
                fill="#185FA5"
                radius={[0, 4, 4, 0]}
                label={{
                  position: "right",
                  fontSize: 11,
                  fill: "#94a3b8",
                  formatter: (
                    v: string | number | undefined | null | boolean,
                  ) => {
                    if (typeof v === "number" || typeof v === "string")
                      return v;
                    return "";
                  },
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[12px] text-slate-400">
            {allItems.length} entries · {total} total members
            {rest.length > 0 && (
              <span className="ml-1 text-slate-300">
                · {rest.length} grouped into "Others"
              </span>
            )}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Capped bar section ───────────────────────────────────────────────────────

const INLINE_CAP = 6;

const BarSection: React.FC<{
  title: string;
  items: { label: string; value: number }[];
  total: number;
  barColor: string;
}> = ({ title, items, total, barColor }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const capped = items.slice(0, INLINE_CAP);
  const hasMore = items.length > INLINE_CAP;

  return (
    <>
      <AnimatePresence>
        {modalOpen && (
          <BreakdownModal
            title={title}
            allItems={items}
            total={total}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>{title}</SectionTitle>
          {hasMore && (
            <button
              onClick={() => setModalOpen(true)}
              className="text-[11px] font-medium text-[#185FA5] hover:underline underline-offset-2 shrink-0"
            >
              View all ({items.length})
            </button>
          )}
        </div>
        {capped.length === 0 ? (
          <p className="text-[13px] text-slate-400">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {capped.map(({ label, value }) => (
              <BarRow
                key={label}
                label={label}
                value={value}
                total={total}
                barColor={barColor}
              />
            ))}
            {hasMore && (
              <button
                onClick={() => setModalOpen(true)}
                className="text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2 pt-1"
              >
                + {items.length - INLINE_CAP} more
              </button>
            )}
          </div>
        )}
      </Card>
    </>
  );
};

// ─── MembershipReport ─────────────────────────────────────────────────────────

export const MembershipReport: React.FC = () => {
  const { data, isLoading } = useMembershipReport();

  const total = data?.total ?? 0;
  const active = data?.active ?? 0;
  const inactive = data?.inactive ?? 0;
  const newThisMonth = data?.newThisMonth ?? 0;
  const pct = data?.pctVsLastMonth ?? 0;
  const growth = data?.growth ?? [];

  const byRegion = (data?.byRegion ?? []).map((r) => ({
    label: r.region,
    value: r.count,
  }));

  const byInstitution = (data?.byInstitution ?? []).map((i) => ({
    label: i.institution,
    value: i.count,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Members"
          value={isLoading ? "—" : total.toLocaleString()}
          sub={isLoading ? undefined : `${newThisMonth} this month`}
          subUp
          icon={<Users size={16} />}
          iconBg="bg-[#E6F1FB]"
          iconColor="text-[#185FA5]"
        />
        <StatCard
          label="New This Month"
          value={isLoading ? "—" : newThisMonth}
          sub={isLoading ? undefined : `${Math.abs(pct)}% vs last`}
          subUp={pct >= 0}
          icon={<TrendingUp size={16} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Active"
          value={isLoading ? "—" : active.toLocaleString()}
          icon={<CheckCircle2 size={16} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          valueColor="text-green-700"
        />
        <StatCard
          label="Inactive"
          value={isLoading ? "—" : inactive.toLocaleString()}
          icon={<Clock size={16} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          valueColor="text-amber-600"
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionTitle>Member Growth</SectionTitle>
          <ExportBtn format="CSV" onClick={() => {}} />
        </div>
        {growth.length === 0 ? (
          <p className="text-[13px] text-slate-400 text-center py-10">
            No data yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={growth}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#185FA5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="members"
                name="Members"
                stroke="#185FA5"
                strokeWidth={2}
                fill="url(#mg)"
                dot={{ fill: "#185FA5", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#0C447C", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <BarSection
          title="By Region"
          items={byRegion}
          total={total}
          barColor="bg-[#185FA5]"
        />
        <BarSection
          title="By Institution"
          items={byInstitution}
          total={total}
          barColor="bg-[#0C447C]"
        />
      </div>
    </div>
  );
};

export default MembershipReport;
