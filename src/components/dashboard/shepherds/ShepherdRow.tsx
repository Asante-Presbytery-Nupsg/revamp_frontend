import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Shepherd, DrawerContent } from "./types";
import { avg, ini, rateColor, rateBar } from "./helpers";
import ShepherdMenu from "./ShepherdMenu";

const ShepherdRow: React.FC<{
  shepherd: Shepherd;
  search: string;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDrawer: (c: DrawerContent) => void;
}> = ({ shepherd, search, onDeactivate, onDelete, onOpenDrawer }) => {
  const [open, setOpen] = useState(false);
  const rate = avg(shepherd?.sheep);

  const filtered = search
    ? shepherd.sheep.filter(
        (s) =>
          s.firstName.toLowerCase().includes(search.toLowerCase()) ||
          s.lastName.toLowerCase().includes(search.toLowerCase()) ||
          (s.programme ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : shepherd.sheep;

  if (
    search &&
    filtered.length === 0 &&
    !shepherd.firstName.toLowerCase().includes(search.toLowerCase()) &&
    !shepherd.lastName.toLowerCase().includes(search.toLowerCase()) &&
    !(shepherd.institutionName ?? "")
      .toLowerCase()
      .includes(search.toLowerCase())
  )
    return null;

  return (
    <div className="border-b border-slate-100 last:border-0">
      {/* Row */}
      <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50/60 transition-colors">
        {/* Avatar */}
        <button
          onClick={() => onOpenDrawer({ kind: "shepherd", data: shepherd })}
          className={`w-9 h-9 rounded-full border border-slate-400 items-center justify-center text-[11px] font-bold shrink-0 hidden sm:flex ${
            shepherd.isActive
              ? "bg-[#E6F1FB] text-[#185FA5]"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {ini(shepherd.firstName + " " + shepherd.lastName)}
        </button>

        {/* Name + meta */}
        <div className="flex-1 min-w-0" onClick={() => setOpen((o) => !o)}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDrawer({ kind: "shepherd", data: shepherd });
              }}
              className="text-[14px] font-semibold text-slate-800 hover:text-[#185FA5] transition-colors truncate"
            >
              {shepherd.firstName + " " + shepherd.lastName}
            </button>
            {shepherd.position && (
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap hidden sm:inline">
                {shepherd.position}
              </span>
            )}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                shepherd.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {shepherd.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] text-slate-400 whitespace-nowrap truncate">
              {shepherd.shortName ?? "—"}
              {shepherd.level ? ` · L${shepherd.level}` : ""}
            </span>
            <span className="text-[11px] text-slate-400 whitespace-nowrap hidden sm:inline">
              {shepherd.sheep.length} sheep
            </span>
          </div>
        </div>

        {/* Rate */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#185FA5] rounded-full"
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="text-[12px] font-semibold text-[#185FA5] w-8">
            {rate}%
          </span>
        </div>

        <ShepherdMenu
          shepherd={shepherd}
          onDeactivate={() => onDeactivate(shepherd.id)}
          onDelete={() => onDelete(shepherd.id)}
        />

        <button onClick={() => setOpen((o) => !o)} className="shrink-0 p-0.5">
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={15} className="text-slate-400" />
          </motion.div>
        </button>
      </div>

      {/* Expanded sheep table */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 bg-slate-50/50 overflow-x-auto">
              {filtered.length === 0 ? (
                <p className="px-14 py-5 text-[13px] text-slate-400">
                  No sheep found.
                </p>
              ) : (
                <table className="w-full min-w-120">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {[
                        "Member",
                        "Institution",
                        "Programme",
                        "Attendance",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => {
                      const sRate = s.attendanceRate ?? 0;
                      return (
                        <tr
                          key={s.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-white/70 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex gap-1 items-center">
                              <div className="h-6 w-6 bg-white rounded-sm border border-slate-200 text-gray-600 text-[11px] font-semibold flex items-center justify-center">
                                {ini(s.firstName + " " + s.lastName)}
                              </div>
                              <span className="text-[13px] font-medium text-slate-900">
                                {s.firstName + " " + s.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[12px] text-slate-500">
                            {s.institution ?? "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[12px] text-slate-500">
                            {s.programme ?? "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${rateBar(sRate)}`}
                                  style={{ width: `${sRate}%` }}
                                />
                              </div>
                              <span
                                className={`text-[11px] font-semibold ${rateColor(sRate)}`}
                              >
                                {sRate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                onOpenDrawer({ kind: "sheep", data: s })
                              }
                              className="text-[11px] font-medium text-[#185FA5] hover:underline underline-offset-2"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShepherdRow;
