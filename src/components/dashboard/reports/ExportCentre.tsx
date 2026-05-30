import { useState } from "react";
import {
  ChevronDown,
  Users,
  CalendarCheck,
  Shield,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Card, ExportBtn } from "./ReportPrimitives";
import { EXPORT_ITEMS } from "./reportData";
import type { ReactNode } from "react";

// Map label → icon (keeps data file icon-free)
const ICONS: Record<string, ReactNode> = {
  "Members List": <Users size={16} />,
  "Attendance Report": <CalendarCheck size={16} />,
  "Shepherd Performance": <Shield size={16} />,
  "Event Summary": <FileText size={16} />,
  "Regional Breakdown": <TrendingUp size={16} />,
};

const FilterSelect: React.FC<{
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl appearance-none bg-white
                   focus:outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#185FA5]/20 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  </div>
);

export const ExportCentre: React.FC = () => {
  const [range, setRange] = useState("all");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <p className="text-[13px] font-semibold text-slate-900 mb-4">
          Export Filters
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FilterSelect
            label="Date Range"
            value={range}
            onChange={setRange}
            options={[
              { value: "all", label: "All time" },
              { value: "month", label: "This month" },
              { value: "quarter", label: "This quarter" },
              { value: "year", label: "This year" },
            ]}
          />
          <FilterSelect
            label="Region"
            value={region}
            onChange={setRegion}
            options={[
              { value: "", label: "All regions" },
              { value: "ashanti", label: "Ashanti" },
              { value: "accra", label: "Greater Accra" },
              { value: "central", label: "Central" },
            ]}
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>
      </Card>

      <div className="space-y-3">
        {EXPORT_ITEMS.map(({ label, desc, formats }) => (
          <Card key={label} className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E6F1FB] text-[#185FA5] flex items-center justify-center shrink-0">
              {ICONS[label]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-slate-900">
                {label}
              </p>
              <p className="text-[12px] text-slate-400 mt-0.5 truncate">
                {desc}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {formats.map((f) => (
                <ExportBtn
                  key={f}
                  format={f}
                  onClick={() => console.log(`export ${label} as ${f}`)}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExportCentre;
