import React from "react";
import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NAV_CONFIG, type Role } from "../nav.config";

interface DashHeaderProps {
  role: Role;
  onMenuOpen: () => void;
  notificationCount?: number;
}

const DashHeader: React.FC<DashHeaderProps> = ({
  role,
  onMenuOpen,
  notificationCount = 0,
}) => {
  const { pathname } = useLocation();

  // Find current page label from nav config
  const allItems = NAV_CONFIG[role]
    .flatMap((s) => s.items)
    .sort((a, b) => b.to.length - a.to.length);

  const current = allItems.find((item) => {
    if (item.to === pathname) return true;
    if (item.to === "/") return false;
    return pathname.startsWith(item.to + "/") || pathname === item.to;
  });

  if (!current) return null;
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
      {/* Left: mobile toggle + page title */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-[15px] font-semibold text-slate-900 leading-tight">
            {"Dashboard"}
          </h1>
          <p className="text-[11px] text-slate-400 font-light hidden sm:block">
            {new Date().toLocaleDateString("en-GH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right: notifications */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};

export default DashHeader;
