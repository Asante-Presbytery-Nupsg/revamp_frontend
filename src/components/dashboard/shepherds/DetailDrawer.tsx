import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  GraduationCap,
  BookOpen,
  Phone,
  Mail,
  Shield,
  Users,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { DrawerContent, Sheep, Shepherd, PendingShepherd } from "./types";
import { avg, ini, rateColor, rateBar } from "./helpers";

// ─── Shared sub-components ────────────────────────────────────────────────────

export const DRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-slate-400 shrink-0 mt-0.5">{icon}</span>
    <span className="text-[12px] text-slate-400 w-20 shrink-0 mt-0.5 leading-snug">
      {label}
    </span>
    <span className="text-[13px] truncate font-medium text-slate-900 break-all min-w-0">
      {value}
    </span>
  </div>
);

export const DSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="px-5">
    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-2">
      {title}
    </p>
    {children}
  </div>
);

// ─── Desktop/mobile detection ─────────────────────────────────────────────────

const useIsDesktop = () => {
  const [desktop, setDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  );
  useEffect(() => {
    const fn = () => setDesktop(window.innerWidth >= 1024);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return desktop;
};

// ─── DetailDrawer ─────────────────────────────────────────────────────────────

const DetailDrawer: React.FC<{
  content: DrawerContent;
  onClose: () => void;
  onApprove?: () => void;
  onDecline?: () => void;
}> = ({ content, onClose, onApprove, onDecline }) => {
  const desktop = useIsDesktop();

  const panelClass = desktop
    ? "w-[400px] h-full"
    : "w-full rounded-t-2xl max-h-[92vh]";

  const initial = desktop ? { x: "100%", y: 0 } : { x: 0, y: "100%" };
  const exit = desktop ? { x: "100%", y: 0 } : { x: 0, y: "100%" };

  const name = content.data.firstName + " " + content.data.lastName;

  const inst =
    content.kind === "sheep"
      ? (content.data as Sheep).institution
      : (content.data as Shepherd | PendingShepherd).institutionName;

  return (
    <div
      className={`fixed backdrop-blur-[2px] inset-0 z-60 flex ${desktop ? "justify-end items-stretch" : "items-end"}`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={initial}
        animate={{ x: 0, y: 0 }}
        exit={exit}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`relative bg-white shadow-2xl flex flex-col overflow-hidden z-10 ${panelClass}`}
      >
        {/* Mobile drag handle */}
        {!desktop && (
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-9 h-1 rounded-full bg-slate-200" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0 ${
              content.kind === "sheep"
                ? "bg-[#E6F1FB] text-[#185FA5]"
                : content.kind === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#0C447C] text-white"
            }`}
          >
            {ini(name)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-slate-900 truncate leading-snug">
              {name}
            </p>
            <p className="text-[12px] text-slate-400 truncate">
              {content.kind === "sheep"
                ? `Member · ${inst ?? "—"}`
                : content.kind === "pending"
                  ? `Pending · ${inst ?? "—"}`
                  : `Shepherd · ${inst ?? "—"}`}
            </p>
          </div>

          {content.kind === "shepherd" && (
            <span
              className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                (content.data as Shepherd).isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {(content.data as Shepherd).isActive ? "Active" : "Inactive"}
            </span>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* ── Sheep ── */}
          {content.kind === "sheep" &&
            (() => {
              const s = content.data as Sheep;
              const rate = s.attendanceRate ?? 0;
              return (
                <>
                  <DSection title="Details">
                    <DRow
                      icon={<GraduationCap size={13} />}
                      label="Institution"
                      value={s.institution ?? "—"}
                    />
                    <DRow
                      icon={<BookOpen size={13} />}
                      label="Programme"
                      value={s.programme ?? "—"}
                    />
                    <DRow
                      icon={<Phone size={13} />}
                      label="Phone"
                      value={s.phoneNumber ?? "—"}
                    />
                  </DSection>
                  <DSection title="Attendance">
                    <div className="pt-1 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] text-slate-600">
                          Overall rate
                        </span>
                        <span
                          className={`text-[17px] font-bold ${rateColor(rate)}`}
                        >
                          {rate}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${rateBar(rate)}`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {rate >= 80
                          ? "Excellent"
                          : rate >= 60
                            ? "Moderate — could improve"
                            : "Needs attention"}
                      </p>
                    </div>
                  </DSection>
                </>
              );
            })()}

          {/* ── Shepherd ── */}
          {content.kind === "shepherd" &&
            (() => {
              const s = content.data as Shepherd;
              const rate = avg(s.sheep);
              return (
                <>
                  <DSection title="Personal">
                    <DRow
                      icon={<GraduationCap size={13} />}
                      label="Institution"
                      value={s.institutionName ?? "—"}
                    />
                    <DRow
                      icon={<Shield size={13} />}
                      label="Level"
                      value={s.level ? `Level ${s.level}` : "—"}
                    />
                    <DRow
                      icon={<Phone size={13} />}
                      label="Phone"
                      value={s.phoneNumber ?? "—"}
                    />
                    <DRow
                      icon={<Mail size={13} />}
                      label="Email"
                      value={s.email}
                    />
                    {s.position && (
                      <DRow
                        icon={<Users size={13} />}
                        label="Position"
                        value={s.position}
                      />
                    )}
                    {s.region && (
                      <DRow
                        icon={<MapPin size={13} />}
                        label="Region"
                        value={s.region}
                      />
                    )}
                    <DRow
                      icon={<Clock size={13} />}
                      label="Joined"
                      value={new Date(s.createdAt).toLocaleDateString()}
                    />
                  </DSection>

                  <DSection title={`Sheep (${s.sheep.length})`}>
                    {s.sheep.length === 0 ? (
                      <p className="text-[13px] text-slate-400 py-2">
                        No sheep assigned.
                      </p>
                    ) : (
                      s.sheep.map((sh) => {
                        const shRate = sh.attendanceRate ?? 0;
                        return (
                          <div
                            key={sh.id}
                            className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-50 last:border-0"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 shrink-0">
                                {ini(sh.firstName + " " + sh.lastName)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] font-medium text-slate-900 truncate">
                                  {sh.firstName + " " + sh.lastName}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {sh.programme ?? "—"}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-[12px] font-bold shrink-0 ${rateColor(shRate)}`}
                            >
                              {shRate}%
                            </span>
                          </div>
                        );
                      })
                    )}
                  </DSection>

                  <DSection title="Avg Attendance">
                    <div className="pt-1 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] text-slate-600">
                          Across all sheep
                        </span>
                        <span className="text-[17px] font-bold text-[#185FA5]">
                          {rate}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#185FA5] rounded-full"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  </DSection>
                </>
              );
            })()}

          {/* ── Pending ── */}
          {content.kind === "pending" &&
            (() => {
              const p = content.data as PendingShepherd;
              return (
                <>
                  <DSection title="Application">
                    <div className="flex items-center gap-1.5 py-2 text-[12px] text-slate-500">
                      <Clock size={12} className="text-amber-500" />
                      <span>
                        Applied {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </DSection>

                  <DSection title="Registration Details">
                    <DRow
                      icon={<GraduationCap size={13} />}
                      label="Institution"
                      value={p.institutionName ?? "—"}
                    />
                    <DRow
                      icon={<BookOpen size={13} />}
                      label="Programme"
                      value={p.programme ?? "—"}
                    />
                    <DRow
                      icon={<Shield size={13} />}
                      label="Level"
                      value={p.level ? `Level ${p.level}` : "—"}
                    />
                    <DRow
                      icon={<MapPin size={13} />}
                      label="Region"
                      value={p.region ?? "—"}
                    />
                    <DRow
                      icon={<Phone size={13} />}
                      label="Phone"
                      value={p.phoneNumber ?? "—"}
                    />
                    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50">
                      <span className="text-slate-400 shrink-0 mt-0.5">
                        <Mail size={13} />
                      </span>
                      <span className="text-[12px] text-slate-400 w-20 shrink-0 mt-0.5">
                        Email
                      </span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[13px] font-medium text-slate-900 truncate">
                          {p.email}
                        </span>
                        <a
                          href={`mailto:${p.email}`}
                          className="shrink-0 text-slate-400 hover:text-[#185FA5] transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </DSection>
                </>
              );
            })()}
        </div>

        {/* Pending footer */}
        {content.kind === "pending" && (
          <div className="px-5 pb-6 pt-3 flex gap-3 border-t border-slate-100 shrink-0">
            <button
              onClick={() => {
                onDecline?.();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-[13px] font-semibold transition-colors"
            >
              <XCircle size={15} /> Decline
            </button>
            <button
              onClick={() => {
                onApprove?.();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-semibold transition-colors"
            >
              <CheckCircle2 size={15} /> Approve
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DetailDrawer;
