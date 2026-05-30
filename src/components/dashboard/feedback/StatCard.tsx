const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  accent?: string;
}> = ({ label, value, icon, color, bg, accent }) => (
  <div className="relative bg-white rounded-lg border border-slate-200 p-4 sm:p-5 overflow-hidden group hover:border-slate-200 transition-colors">
    {/* Subtle corner accent */}
    <div
      className={`absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-[0.07] ${accent ?? bg}`}
    />
    <div className="flex items-start gap-3 relative">
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center ${bg} ${color} transition-transform group-hover:scale-105`}
      >
        {icon}
      </div>
      <div>
        <p className="font-serif font-light text-[24px] sm:text-[28px] leading-none text-[#0c0d0e] tracking-tight">
          {value}
        </p>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  </div>
);

export default StatCard;
