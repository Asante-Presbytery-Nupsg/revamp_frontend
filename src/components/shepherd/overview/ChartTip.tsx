const ChartTip: React.FC<{
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: number }>;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-md px-3 py-2 shadow-sm text-[12px]">
      <p className="font-medium text-slate-700 mb-0.5">{label}</p>
      <p className="text-[#185FA5]">{payload[0].value}% attendance</p>
    </div>
  );
};

export default ChartTip;
