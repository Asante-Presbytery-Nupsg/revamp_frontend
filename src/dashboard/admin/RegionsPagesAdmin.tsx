"use no memo";

import { useState } from "react";
import { MapPin, Building2 } from "lucide-react";
import { RegionsTab } from "@/components/dashboard/regions/RegionsTab";
import { InstitutionsTab } from "@/components/dashboard/regions/InstitutionsTab";
import type { Tab } from "@/components/dashboard/regions/regionData";

// ─── Config ───────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "regions",
    label: "Regions & Presbyteries",
    icon: <MapPin size={14} />,
  },
  { id: "institutions", label: "Institutions", icon: <Building2 size={14} /> },
];

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  regions: <RegionsTab />,
  institutions: <InstitutionsTab />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const RegionsPagesAdmin: React.FC = () => {
  const [tab, setTab] = useState<Tab>("regions");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight">
          Regions & Institutions
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Manage regions, presbyteries and institutions
        </p>
      </div>

      {/* Underline tabs */}
      <div className="flex border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
              tab === t.id
                ? "border-[#0C447C] text-[#0C447C]"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {TAB_CONTENT[tab]}
    </div>
  );
};

export default RegionsPagesAdmin;
