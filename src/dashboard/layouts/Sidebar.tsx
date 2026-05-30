import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, X } from "lucide-react";
import logo from "@/assets/NUPSGLOGO.svg";
import { NAV_CONFIG, ROLE_LABELS, type Role } from "../nav.config";
import { useAuthStore } from "@/store/useAuthStore";

// ─── Types

interface SidebarProps {
  role: Role;
  user: {
    name: string;
    email: string;
    initials: string;
  };
  onClose?: () => void; // mobile close
}

// ─── Nav item

const NavItem = ({
  icon: Icon,
  label,
  to,
  badge,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: string;
  active: boolean;
  onClick?: () => void;
}) => (
  <Link to={to} onClick={onClick} className="block group">
    <div
      className={`
        flex items-center justify-between px-3 py-2 rounded-lg
        transition-all duration-150
        ${
          active
            ? "bg-blue-50 text-[#0C447C]"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          className={
            active
              ? "text-[#185FA5]"
              : "text-slate-400 group-hover:text-slate-500"
          }
        />
        <span
          className={`text-sm tracking-tight ${active ? "font-semibold text-[#0C447C]" : "font-medium text-slate-700"}`}
        >
          {label}
        </span>
      </div>
      {badge && (
        <span
          className={`text-sm font-semibold ${active ? "text-[#185FA5]" : "text-[#185FA5]"}`}
        >
          {badge}
        </span>
      )}
    </div>
  </Link>
);

// ─── Section

const NavSection = ({
  title,
  items,
  pathname,
  onItemClick,
}: {
  title?: string;
  items: {
    icon: React.ElementType;
    label: string;
    to: string;
    badge?: string;
  }[];
  pathname: string;
  onItemClick?: () => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {title && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-1.5 mb-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <span className="text-[11px] font-semibold tracking-wide text-slate-500">
            {title}
          </span>
          <motion.div
            animate={{ rotate: open ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={13} className="text-slate-400" />
          </motion.div>
        </button>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden space-y-0.5"
          >
            {items.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                active={
                  pathname === item.to ||
                  (item.to !== "/" &&
                    pathname.startsWith(item.to) &&
                    pathname.split("/").length === item.to.split("/").length)
                }
                onClick={onItemClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sidebar

const Sidebar: React.FC<SidebarProps> = ({ role, user, onClose }) => {
  const { pathname } = useLocation();
  const sections = NAV_CONFIG[role];

  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-64 xl:w-72 bg-white h-screen flex flex-col border-r border-slate-100 p-4 sticky top-0 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-7">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="NUPS-G" className="w-8 h-8 object-contain" />
          <div className="flex flex-col leading-none">
            <span className="font-serif italic font-semibold text-[16px] text-[#0C447C] tracking-tight">
              NUPS-G
            </span>
            <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-slate-400 mt-0.5">
              {ROLE_LABELS[role]}
            </span>
          </div>
        </Link>

        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto space-y-5 pr-1">
        {sections.map((section, i) => (
          <NavSection
            key={i}
            title={section.title}
            items={section.items}
            pathname={pathname}
            onItemClick={onClose}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-4" />

      {/* User card */}
      <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between bg-slate-50/50 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#E6F1FB] flex items-center justify-center border border-slate-200">
              <span className="text-[12px] font-semibold text-[#185FA5]">
                {user.initials}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 leading-tight truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              {user.email}
            </p>
          </div>
        </div>

        <button
          className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors shrink-0"
          title="Sign out"
          onClick={() => {
            logout();
          }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
