import React from "react";
import { Shield, CheckCircle2, Users, TrendingUp } from "lucide-react";

interface Props {
  total: number;
  active: number;
  totalSheep: number;
  avgRate: number;
}

const StatsBar: React.FC<Props> = ({ total, active, totalSheep, avgRate }) => {
  const items = [
    {
      label: "Total Shepherds",
      value: total,
      icon: <Shield size={16} />,
      color: "text-[#0C447C]",
      bg: "bg-[#E6F1FB]",
    },
    {
      label: "Active",
      value: active,
      icon: <CheckCircle2 size={16} />,
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      label: "Total Sheep",
      value: totalSheep,
      icon: <Users size={16} />,
      color: "text-[#0C447C]",
      bg: "bg-[#E6F1FB]",
    },
    {
      label: "Avg Attendance",
      value: `${avgRate}%`,
      icon: <TrendingUp size={16} />,
      color: "text-[#0C447C]",
      bg: "bg-[#E6F1FB]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map(({ label, value, icon, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-slate-200 p-5"
        >
          <div
            className={`w-9 h-9 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}
          >
            {icon}
          </div>
          <p
            className={`font-serif text-[30px] font-light leading-none tracking-tight ${color}`}
          >
            {value}
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-1.5">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
