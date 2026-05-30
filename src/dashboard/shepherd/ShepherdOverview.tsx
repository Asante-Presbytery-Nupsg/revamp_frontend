"use no memo";

import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useShepherdOverview } from "@/hooks/queries/useShepherdOverview";
import { useAuthStore } from "@/store/useAuthStore";
import { SheepTable } from "@/components/shepherd/overview/SheepTable";
import {
  RecentSessions,
  UpcomingEvents,
} from "@/components/shepherd/overview/OverviewCards";
import Spinner from "@/components/ui/Spinner";
import ChartTip from "@/components/shepherd/overview/ChartTip";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const ShepherdOverview: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.firstName ?? "Shepherd";

  const { data, isLoading } = useShepherdOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner size={12} />
      </div>
    );
  }

  const stats = data?.stats;
  const trend = data?.trend ?? [];
  const sheep = data?.sheep ?? [];
  const recentSessions = data?.recentSessions.slice(0, 4) ?? [];
  const upcomingEvents = data?.upcomingEvents.slice(0, 4) ?? [];

  const STATS = [
    {
      label: "My Sheep",
      value: stats?.sheepCount ?? 0,
      icon: <Users size={16} />,
      color: "text-[#0C447C]",
      bg: "bg-[#E6F1FB]",
      iconColor: "text-[#185FA5]",
    },
    {
      label: "Avg Attendance",
      value: `${stats?.avgAttendanceRate ?? 0}%`,
      icon: <TrendingUp size={16} />,
      color: "text-green-600",
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Sessions This Month",
      value: stats?.sessionsThisMonth ?? 0,
      icon: <CalendarCheck size={16} />,
      color: "text-[#0C447C]",
      bg: "bg-[#E6F1FB]",
      iconColor: "text-[#185FA5]",
    },
    {
      label: "Needs Attention",
      value: stats?.needsAttention ?? 0,
      icon: <Clock size={16} />,
      color:
        (stats?.needsAttention ?? 0) > 0 ? "text-amber-600" : "text-slate-400",
      bg: (stats?.needsAttention ?? 0) > 0 ? "bg-amber-50" : "bg-slate-100",
      iconColor:
        (stats?.needsAttention ?? 0) > 0 ? "text-amber-600" : "text-slate-400",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl px-1.5 sm:px-0">
      {/* Header */}
      <div>
        <p className="text-[12px] font-medium text-slate-400">
          {new Date().toLocaleDateString("en-GH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight mt-0.5">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Here's how your flock is doing
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map(({ label, value, icon, color, bg, iconColor }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5"
          >
            <div
              className={`w-9 h-9 rounded-xl ${bg} ${iconColor} flex items-center justify-center mb-3`}
            >
              {icon}
            </div>
            <p
              className={`font-serif text-[26px] sm:text-[28px] font-light leading-none tracking-tight ${color}`}
            >
              {value}
            </p>
            <p className="text-[11px] font-medium text-slate-400 mt-1.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Attendance trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[14px] font-semibold text-slate-900">
            Attendance Trend
          </h3>
          <button
            onClick={() => navigate("/dashboard/shepherd/attendance")}
            className="flex items-center gap-1 text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2"
          >
            View all <ChevronRight size={13} />
          </button>
        </div>
        {trend.every((t) => t.rate === 0) ? (
          <div className="h-45 flex items-center justify-center">
            <p className="text-[13px] text-slate-400 font-light">
              No attendance data yet
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={trend}
              margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
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
                domain={[0, 100]}
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
      </div>

      {/* Sessions + Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <RecentSessions data={recentSessions} />
        <UpcomingEvents data={upcomingEvents} />
      </div>

      {/* Sheep table */}
      <SheepTable data={sheep} />
    </div>
  );
};

export default ShepherdOverview;
