import React from "react";
import Card from "./Card";
import { ArrowDown, ArrowUp, Users, UserCheck, Calendar, TrendingUp } from "lucide-react";
import { useDashboardStats } from "@/hooks/queries/useDashboard";

interface StatItem {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

const StatsGrid: React.FC = () => {
  const { data, isLoading } = useDashboardStats();

  const stats: StatItem[] = [
    {
      label: "Total Members",
      value: isLoading ? "—" : (data?.totalMembers ?? 0).toLocaleString(),
      change: `${Math.abs(data?.membersChange ?? 0)}%`,
      up: (data?.membersChange ?? 0) >= 0,
      icon: Users,
      color: "bg-[#E6F1FB] text-[#185FA5]",
    },
    {
      label: "Active Shepherds",
      value: isLoading ? "—" : (data?.totalShepherds ?? 0).toLocaleString(),
      change: `${Math.abs(data?.shepherdsChange ?? 0)}%`,
      up: (data?.shepherdsChange ?? 0) >= 0,
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Upcoming Events",
      value: isLoading ? "—" : (data?.upcomingEvents ?? 0),
      change: `${Math.abs(data?.eventsChange ?? 0)}%`,
      up: (data?.eventsChange ?? 0) >= 0,
      icon: Calendar,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Avg Attendance",
      value: isLoading ? "—" : (data?.avgAttendance ?? 0).toLocaleString(),
      change: `${Math.abs(data?.attendanceChange ?? 0)}%`,
      up: (data?.attendanceChange ?? 0) >= 0,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(({ label, value, change, up, icon: Icon, color }) => (
        <Card key={label} className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
            >
              <Icon size={18} />
            </div>
            <span
              className={`text-[11px] flex items-center gap-1 font-medium ${up ? "text-green-600" : "text-red-400"}`}
            >
              {up ? (
                <ArrowUp size={12} className="inline" />
              ) : (
                <ArrowDown size={12} className="inline" />
              )}{" "}
              {change}
            </span>
          </div>
          <p className="font-serif text-[32px] font-light text-[#0c0d0e] leading-none tracking-tight">
            {value}
          </p>
          <p className="text-[12px] font-medium text-slate-400 mt-1">{label}</p>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
