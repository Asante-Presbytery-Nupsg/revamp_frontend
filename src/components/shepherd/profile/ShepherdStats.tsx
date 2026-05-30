import { Users, CalendarCheck, TrendingUp, Loader2 } from "lucide-react";
import { useShepherdProfile } from "@/hooks/queries/useShepherdProfile";

export const ShepherdStats: React.FC = () => {
  const { data, isLoading } = useShepherdProfile();

  const STATS = [
    {
      label: "Sheep assigned",
      value: isLoading ? null : (data?.sheepCount ?? 0),
      icon: <Users size={15} />,
      color: "text-[#185FA5]",
      bg: "bg-[#E6F1FB]",
    },
    {
      label: "Sessions taken",
      value: isLoading ? null : (data?.sessions ?? 0),
      icon: <CalendarCheck size={15} />,
      color: "text-[#185FA5]",
      bg: "bg-[#E6F1FB]",
    },
    {
      label: "Avg attendance",
      value: isLoading ? null : `${data?.avgRate ?? 0}%`,
      icon: <TrendingUp size={15} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {STATS.map(({ label, value, icon, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 text-center"
        >
          <div
            className={`w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center mx-auto mb-2`}
          >
            {icon}
          </div>
          {value === null ? (
            <Loader2
              size={14}
              className="animate-spin text-slate-300 mx-auto"
            />
          ) : (
            <p
              className={`text-[16px] sm:text-[18px] font-bold leading-none ${color}`}
            >
              {value}
            </p>
          )}
          <p className="text-[10px] font-medium text-slate-400 mt-1 leading-tight">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ShepherdStats;
