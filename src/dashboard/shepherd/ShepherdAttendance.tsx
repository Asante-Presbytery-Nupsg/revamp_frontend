"use no memo";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Users,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { SummaryModal } from "@/components/shepherd/attendance/SummaryModal";
import { SheepRow } from "@/components/shepherd/attendance/SheepRow";
import { useMySheep } from "@/hooks/queries/useShepherds";
import { useCreateAttendance } from "@/hooks/queries/useAttendance";
import type { AttendanceStatus } from "@/api/attendance.api";
import { useAuthStore } from "@/store/useAuthStore";

// ─── Types ────────────────────────────────────────────────────────────────────

// Nullable variant used in local state — null = "not yet marked"
type RecordMap = Record<string, AttendanceStatus | null>;

// ─── Adapt ────────────────────────────────────────────────────────────────────

const adaptSheep = (s: {
  id: string;
  firstName: string;
  lastName: string;
  institution: string | null;
  programme: string | null;
}) => ({
  id: s.id,
  name: `${s.firstName} ${s.lastName}`,
  institution: s.institution ?? "—",
  programme: s.programme ?? "—",
  phone: "",
});

type AdaptedSheep = ReturnType<typeof adaptSheep>;

// ─── Page ─────────────────────────────────────────────────────────────────────

const ShepherdAttendance: React.FC = () => {
  const today = new Date().toISOString().split("T")[0]!;
  const [date, setDate] = useState<string>(today);
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<
    Record<string, AttendanceStatus | null>
  >({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: page, isLoading } = useMySheep({ limit: 100 });

  const rawSheep = useMemo(() => page?.data ?? [], [page]);
  const sheep = useMemo<AdaptedSheep[]>(
    () => rawSheep.map(adaptSheep),
    [rawSheep],
  );

  const { user } = useAuthStore();
  const createAttendance = useCreateAttendance();

  // Cycle: unmarked → present → absent → unmarked
  const toggle = (id: string) =>
    setRecords((prev) => ({
      ...prev,
      [id]:
        prev[id] === "present"
          ? "absent"
          : prev[id] === "absent"
            ? null
            : "present",
    }));

  const markAll = (status: AttendanceStatus) => {
    const next: RecordMap = {};
    sheep.forEach((s) => {
      next[s.id] = status;
    });
    setRecords(next);
  };

  const handleConfirm = async () => {
    const entries = sheep.filter(
      (s) => records[s.id] === "present" || records[s.id] === "absent",
    );
    const promises = entries.map((s) =>
      createAttendance.mutateAsync({
        sheepId: s.id,
        date,
        status: records[s.id] as AttendanceStatus,
        notes: notes.trim() || undefined,
        shepherdId: String(user?.id),
      }),
    );
    await Promise.all(promises);
    setShowSummary(false);
    setSubmitted(true);
  };

  const presentCount = Object.values(records).filter(
    (v) => v === "present",
  ).length;
  const absentCount = Object.values(records).filter(
    (v) => v === "absent",
  ).length;
  const markedCount = presentCount + absentCount;

  // ── Success ──────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={32} className="text-green-500" />
        </motion.div>
        <h2 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight mb-2">
          Attendance saved.
        </h2>
        <p className="text-[14px] font-light text-slate-400 max-w-xs mb-8">
          {presentCount} present · {absentCount} absent · {date}
        </p>
        <button
          onClick={() => {
            setRecords({});
            setSubmitted(false);
            setDate(today);
            setNotes("");
          }}
          className="px-6 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors"
        >
          Take new attendance
        </button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSummary && (
          <SummaryModal
            date={new Date(date).toLocaleDateString("en-GH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            records={records}
            sheep={sheep}
            onClose={() => setShowSummary(false)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>

      <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto px-1.5 sm:px-0">
        <div>
          <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight leading-tight">
            Attendance
          </h1>
          <p className="text-[13px] font-light text-slate-400 mt-0.5">
            Mark your sheep for today's check-in
          </p>
        </div>

        {/* Date + Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="eg. Bible study session"
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                           transition-colors placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => markAll("present")}
              disabled={isLoading || sheep.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-40"
            >
              <CheckCircle2 size={13} /> Mark all present
            </button>
            <button
              onClick={() => markAll("absent")}
              disabled={isLoading || sheep.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-40"
            >
              <XCircle size={13} /> Mark all absent
            </button>
            <button
              onClick={() => setRecords({})}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <X size={13} /> Clear
            </button>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <Users size={13} />
            <span>
              {markedCount}/{sheep.length} marked
            </span>
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-100">
            <Loader2 size={20} className="text-slate-300 animate-spin" />
          </div>
        ) : sheep.length === 0 ? (
          <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-[13px] font-light text-slate-400">
              No sheep assigned yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {sheep.map((s, i) => (
              <SheepRow
                key={s.id}
                sheep={s}
                status={records[s.id] ?? null}
                isLast={i === sheep.length - 1}
                onToggle={() => toggle(s.id)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6">
          <p className="text-[12px] text-slate-400 order-2 sm:order-1">
            {sheep.length === 0
              ? ""
              : markedCount < sheep.length
                ? `${sheep.length - markedCount} sheep not yet marked`
                : "All sheep marked ✓"}
          </p>
          <button
            onClick={() => setShowSummary(true)}
            disabled={markedCount === 0 || createAttendance.isPending}
            className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2
                       px-6 py-3 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium
                       rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createAttendance.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                Review & Submit <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ShepherdAttendance;
