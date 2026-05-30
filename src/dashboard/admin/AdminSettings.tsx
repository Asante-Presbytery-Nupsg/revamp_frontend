"use no memo";

import { useState } from "react";
import {
  User,
  Building2,
  Calendar,
  Bell,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { ProfileTab } from "@/components/dashboard/settings/ProfileTab";
import { OrgTab } from "@/components/dashboard/settings/OrgTab";
import { SessionTab } from "@/components/dashboard/settings/SessionTab";
import { NotifTab } from "@/components/dashboard/settings/NotifTab";
import { RolesTab } from "@/components/dashboard/settings/RolesTab";
import { DangerTab } from "@/components/dashboard/settings/DangerTab";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab =
  | "profile"
  | "organisation"
  | "session"
  | "notifications"
  | "roles"
  | "danger";

// ─── Config ───────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={14} /> },
  { id: "organisation", label: "Organisation", icon: <Building2 size={14} /> },
  { id: "session", label: "Session", icon: <Calendar size={14} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
  { id: "roles", label: "Roles", icon: <Shield size={14} /> },
  { id: "danger", label: "Danger Zone", icon: <AlertTriangle size={14} /> },
];

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  profile: <ProfileTab />,
  organisation: <OrgTab />,
  session: <SessionTab />,
  notifications: <NotifTab />,
  roles: <RolesTab />,
  danger: <DangerTab />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminSettings: React.FC = () => {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight">
          Settings
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Manage your profile and organisation preferences
        </p>
      </div>

      {/* Underline tabs */}
      <div
        className="flex border-b border-slate-200 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
              tab === t.id
                ? t.id === "danger"
                  ? "border-red-500 text-red-600"
                  : "border-[#0C447C] text-[#0C447C]"
                : t.id === "danger"
                  ? "border-transparent text-red-400 hover:text-red-600 hover:border-red-300"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {TAB_CONTENT[tab]}
    </div>
  );
};

export default AdminSettings;
