import { REGIONS } from "@/constants/event-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  Users,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import type { NupsgEvent } from "@/types/event.types";
import ConfirmDialog from "./ConfimDialog";

// ─── Status config ────────────────────────────────────────────────────────
const STATUS = {
  upcoming: {
    label: "Upcoming",
    bg: "bg-sky-50",
    text: "text-sky-600",
    bar: "bg-sky-500",
    dot: "bg-sky-400",
  },
  ongoing: {
    label: "Live",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
    dot: "bg-emerald-400",
  },
  completed: {
    label: "Completed",
    bg: "bg-slate-100",
    text: "text-slate-500",
    bar: "bg-slate-400",
    dot: "bg-slate-300",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-500",
    bar: "bg-rose-400",
    dot: "bg-rose-300",
  },
};

// ─── EventCard ────────────────────────────────────────────────────────────
export const EventCard: React.FC<{
  event: NupsgEvent;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}> = ({ event, onEdit, onDelete, onComplete }) => {
  const [confirm, setConfirm] = useState<null | "delete" | "complete">(null);

  const region = REGIONS.find((r) => r.id === event.regionId);
  const st = STATUS[event.status] ?? STATUS.upcoming;
  const fillPct = Math.min(
    Math.round((event.registered / event.attendanceCap) * 100),
    100,
  );
  const nearFull = fillPct >= 85;
  const isOver = event.status === "completed" || event.status === "cancelled";

  const dateObj = new Date(event.date);
  const valid = !isNaN(dateObj.getTime());
  const day = valid ? dateObj.getDate() : "--";
  const month = valid
    ? dateObj.toLocaleString("default", { month: "short" }).toUpperCase()
    : "---";
  const weekday = valid
    ? dateObj.toLocaleString("default", { weekday: "short" })
    : "";

  return (
    <div
      className="relative group bg-white rounded-xl border border-slate-200/80
                    hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/60
                    transition-all duration-300 overflow-hidden"
    >
      {/* Overlays */}
      <AnimatePresence>
        {/* Delete — uses your external DeleteModal (fixed/fullscreen) */}
        {confirm === "delete" && (
          <DeleteModal
            event={event}
            onClose={() => setConfirm(null)}
            onConfirm={() => {
              setConfirm(null);
              onDelete();
            }}
          />
        )}

        {/* Complete — inline card overlay */}
        {confirm === "complete" && (
          <ConfirmDialog
            message="Mark this event as completed?"
            onConfirm={() => {
              setConfirm(null);
              onComplete();
            }}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="relative px-5 pt-5 pb-0">
        {/* Status pill */}
        <span
          className={`absolute top-5 right-5 inline-flex items-center gap-1.5
                          px-2.5 py-1 rounded-full text-[11px] font-semibold
                          tracking-wide ${st.bg} ${st.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>

        {/* Date + meta */}
        <div className="flex items-end gap-4 mb-4">
          <div
            className="flex flex-col items-center justify-center
                          w-14 h-14 rounded-lg
                          shadow-sm border border-slate-200 bg-white
                          group-hover:scale-105 transition-transform duration-300 shrink-0"
          >
            <span className="text-[9px] font-bold tracking-[0.15em] text-gray-700 uppercase">
              {month}
            </span>
            <span className="text-[26px] font-bold leading-none text-slate-900">
              {day}
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 font-medium ">{weekday}</p>
            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 font-medium">
              <Clock size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            {region && (
              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400 mt-0.5">
                <MapPin size={11} className="text-slate-300 shrink-0" />
                <span className="truncate">{region.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Title + description ─────────────────────────────── */}
      <div className="px-5 pb-4">
        <h3
          className="text-[15.5px] font-bold text-slate-900 leading-snug tracking-tight mb-1
                       group-hover:text-[#0C447C] transition-colors duration-200"
        >
          {event.title}
        </h3>
        <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </div>

      {/* ── Registration stat block ─────────────────────────── */}
      <div className="mx-5 mb-4 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold
                          text-slate-400 uppercase tracking-widest"
          >
            <Users size={11} />
            Registrations
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-[20px] font-bold tabular-nums leading-none
              ${nearFull ? "text-amber-500" : "text-slate-800"}`}
            >
              {event.registered}
            </span>
            <span className="text-[12px] text-slate-300 font-medium">
              / {event.attendanceCap}
            </span>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className={`h-full rounded-full ${nearFull ? "bg-amber-400" : st.bar}`}
          />
        </div>

        {nearFull && !isOver && (
          <p className="mt-1.5 text-[10.5px] font-semibold text-amber-500 flex items-center gap-1">
            <AlertTriangle size={10} />
            {event.attendanceCap - event.registered} spots remaining
          </p>
        )}
      </div>

      {/* ── Admin actions ────────────────────────────────────── */}
      <div className="px-5 pb-5 flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3.5 h-9 rounded-lg
                     bg-[#0C447C] text-white text-[12.5px] font-semibold
                     hover:bg-[#185FA5] active:scale-[0.97]
                     transition-all duration-150 shadow-sm shadow-[#0C447C]/20"
        >
          <Pencil size={12} />
          Edit
        </button>

        {!isOver && (
          <button
            onClick={() => setConfirm("complete")}
            className="flex items-center gap-1.5 px-3.5 h-9 rounded-lg
                       border border-emerald-200 text-emerald-600 text-[12.5px] font-semibold
                       hover:bg-emerald-50 active:scale-[0.97] transition-all duration-150"
          >
            <CheckCircle2 size={12} />
            Complete
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => setConfirm("delete")}
          className="flex items-center gap-1.5 px-3 h-9 rounded-lg
                     text-slate-400 text-[12.5px] font-medium
                     hover:text-rose-500 hover:bg-rose-50
                     active:scale-[0.97] transition-all duration-150"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>

      {/* Hover caret */}
      <div
        className="absolute bottom-13 right-5 opacity-0 group-hover:opacity-100
                      transition-opacity duration-200"
      >
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0C447C] hover:text-white
                     flex items-center justify-center text-slate-400
                     transition-colors duration-150"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
