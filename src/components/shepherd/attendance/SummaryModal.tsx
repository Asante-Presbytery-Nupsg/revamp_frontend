import { motion } from "framer-motion";
import { Save, X, Check } from "lucide-react";
import {
  type Sheep,
  type AttendanceStatus,
} from "../attendance/attendanceData";

// ─── Component ────────────────────────────────────────────────────────────────

export const SummaryModal: React.FC<{
  date: string;
  records: Record<string, AttendanceStatus>;
  sheep: Sheep[];
  onClose: () => void;
  onConfirm: () => void;
}> = ({ date, records, sheep, onClose, onConfirm }) => {
  const present = sheep.filter((s) => records[s.id] === "present");
  const absent = sheep.filter((s) => records[s.id] === "absent");
  const unmarked = sheep.filter((s) => !records[s.id]);

  const STATS = [
    {
      label: "Present",
      count: present.length,
      color: "bg-green-50 text-green-700",
      dot: "bg-green-500",
    },
    {
      label: "Absent",
      count: absent.length,
      color: "bg-red-50 text-red-600",
      dot: "bg-red-400",
    },
    {
      label: "Unmarked",
      count: unmarked.length,
      color: "bg-slate-50 text-slate-500",
      dot: "bg-slate-300",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0d0e]/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif font-light text-[#0c0d0e] text-[22px] tracking-tight">
                Attendance Summary
              </h2>
              <p className="text-[12px] text-slate-400 mt-0.5">{date}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4">
          {STATS.map(({ label, count, color, dot }) => (
            <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
              <p className="font-serif text-[28px] font-light leading-none">
                {count}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                <span className="text-[11px] font-medium">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Present list */}
        {present.length > 0 && (
          <div className="px-6 pb-2">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-2">
              Present
            </p>
            <div className="space-y-1">
              {present.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5 py-1.5">
                  <Check size={13} className="text-green-500 shrink-0" />
                  <span className="text-[13px] font-medium text-slate-900">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-auto">
                    {s.institution}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Absent list */}
        {absent.length > 0 && (
          <div className="px-6 pb-4 mt-2">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-2">
              Absent
            </p>
            <div className="space-y-1">
              {absent.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5 py-1.5">
                  <X size={13} className="text-red-400 shrink-0" />
                  <span className="text-[13px] font-medium text-slate-900">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-auto">
                    {s.institution}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save size={14} /> Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SummaryModal;
