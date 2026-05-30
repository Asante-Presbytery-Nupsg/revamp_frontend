"use no memo";

import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { ini, rateColor, rateBar, rateLabel, type Sheep } from "./sheepData";

// ─── useIsDesktop ─────────────────────────────────────────────────────────────

const useIsDesktop = () => {
  const [desktop, setDesktop] = React.useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  );
  React.useEffect(() => {
    const fn = () => setDesktop(window.innerWidth >= 1024);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return desktop;
};

// ─── Detail rows config ───────────────────────────────────────────────────────

const detailRows = (sheep: Sheep) => [
  {
    icon: <GraduationCap size={13} />,
    label: "Institution",
    value: sheep.institution,
  },
  { icon: <BookOpen size={13} />, label: "Programme", value: sheep.programme },
  { icon: <Phone size={13} />, label: "Phone", value: sheep.phone },
  { icon: <Mail size={13} />, label: "Email", value: sheep.email },
  { icon: <MessageCircle size={13} />, label: "Hostel", value: sheep.hostel },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const SheepDrawer: React.FC<{ sheep: Sheep; onClose: () => void }> = ({
  sheep,
  onClose,
}) => {
  const desktop = useIsDesktop();

  return (
    <div
      className={`fixed inset-0 z-50 flex ${desktop ? "justify-end items-stretch" : "items-end"}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={desktop ? { x: "100%" } : { y: "100%" }}
        animate={{ x: 0, y: 0 }}
        exit={desktop ? { x: "100%" } : { y: "100%" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`relative bg-white shadow-2xl flex flex-col overflow-hidden z-10 ${
          desktop ? "w-95 h-full" : "w-full rounded-t-2xl max-h-[90vh]"
        }`}
      >
        {!desktop && (
          <div className="flex justify-center pt-3 shrink-0">
            <div className="w-9 h-1 rounded-full bg-slate-200" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#E6F1FB] flex items-center justify-center text-[13px] font-bold text-[#185FA5] shrink-0">
            {ini(sheep.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-slate-900 truncate">
              {sheep.name}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="text-[12px] text-slate-400">Active member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* Contact actions */}
          <div className="px-5 flex gap-3">
            <a
              href={`tel:${sheep.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Phone size={13} className="text-slate-400" /> Call
            </a>
            <a
              href={`mailto:${sheep.email}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Mail size={13} className="text-slate-400" /> Email
            </a>
          </div>

          {/* Details */}
          <div className="px-5">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-3">
              Details
            </p>
            <div className="space-y-0">
              {detailRows(sheep).map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0"
                >
                  <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
                  <span className="text-[12px] text-slate-400 w-20 shrink-0">
                    {label}
                  </span>
                  <span className="text-[13px] font-medium text-slate-900 break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className="px-5">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-3">
              Attendance
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-slate-600">Overall rate</span>
              <span
                className={`text-[17px] font-bold ${rateColor(sheep.attendanceRate)}`}
              >
                {sheep.attendanceRate}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
              <div
                className={`h-full rounded-full ${rateBar(sheep.attendanceRate)}`}
                style={{ width: `${sheep.attendanceRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{rateLabel(sheep.attendanceRate)}</span>
              <span>{sheep.sessionCount} sessions attended</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SheepDrawer;
