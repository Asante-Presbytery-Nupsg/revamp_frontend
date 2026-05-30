"use no memo";

import { useState } from "react";
import { Download, Users, CalendarCheck, Shield, FileText } from "lucide-react";
import { MembershipReport } from "@/components/dashboard/reports/MembershipReport";
import { AttendanceReport } from "@/components/dashboard/reports/AttendanceReport";
import { ShepherdReport } from "@/components/dashboard/reports/ShepherdReport";
import { EventReport } from "@/components/dashboard/reports/EventReport";
import { ExportCentre } from "@/components/dashboard/reports/ExportCentre";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "membership" | "attendance" | "shepherds" | "events" | "export";

// ─── Config ───────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "membership", label: "Membership", icon: <Users size={14} /> },
  { id: "attendance", label: "Attendance", icon: <CalendarCheck size={14} /> },
  { id: "shepherds", label: "Shepherds", icon: <Shield size={14} /> },
  { id: "events", label: "Events", icon: <FileText size={14} /> },
  { id: "export", label: "Export", icon: <Download size={14} /> },
];

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  membership: <MembershipReport />,
  attendance: <AttendanceReport />,
  shepherds: <ShepherdReport />,
  events: <EventReport />,
  export: <ExportCentre />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminReports: React.FC = () => {
  const [tab, setTab] = useState<Tab>("membership");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight leading-tight">
            Progress Reports
          </h1>
          <p className="text-[13px] font-light text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("en-GH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => setTab("export")}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors shrink-0"
        >
          <Download size={15} />
          <span className="hidden sm:block">Export</span>
        </button>
      </div>

      {/* Tabs */}
      <div
        className="overflow-x-auto border-b border-slate-200"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex min-w-max">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all ${
                tab === t.id
                  ? "border-[#0C447C] text-[#0C447C]"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {TAB_CONTENT[tab]}
    </div>
  );
};

export default AdminReports;
