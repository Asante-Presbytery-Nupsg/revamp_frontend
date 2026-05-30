import { Clock, MapPin } from "lucide-react";
import type { NupsgEvent } from "@/api/events.api";

// ── TYPE_CONFIG ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  string,
  { label: string; gradient: string; pill: string }
> = {
  conference: {
    label: "Conference",
    gradient: "bg-gradient-to-br from-[#E6F1FB] to-[#B5D4F4]",
    pill: "bg-white/80 text-[#0C447C]",
  },
  rally: {
    label: "Rally",
    gradient: "bg-gradient-to-br from-amber-50 to-amber-100",
    pill: "bg-white/80 text-amber-700",
  },
  prayer: {
    label: "Prayer",
    gradient: "bg-gradient-to-br from-purple-50 to-purple-100",
    pill: "bg-white/80 text-purple-700",
  },
  "bible-study": {
    label: "Bible Study",
    gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    pill: "bg-white/80 text-emerald-700",
  },
  other: {
    label: "Event",
    gradient: "bg-gradient-to-br from-slate-50 to-slate-100",
    pill: "bg-white/80 text-slate-600",
  },
};

const AVATAR_COLORS = [
  "bg-[#B5D4F4] text-[#0C447C]",
  "bg-[#C0DD97] text-[#27500A]",
  "bg-[#FAC775] text-[#633806]",
  "bg-[#D3D1C7] text-[#444441]",
];

const MAX_VISIBLE = 3;

// Backend returns date as ISO string e.g. "2025-08-12"
const isPast = (dateStr: string) => new Date(dateStr) < new Date();

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("en-GH", { month: "short" }),
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

export const EventCard: React.FC<{
  event: NupsgEvent;
  onToggleRegister: (event: NupsgEvent) => void;
  loading: boolean;
}> = ({ event, onToggleRegister, loading }) => {
  const config = TYPE_CONFIG[event.type] ?? TYPE_CONFIG["other"]!;
  const past = isPast(event.date);
  const isFull = event.registered >= event.attendanceCap && !event.isRegistered;
  const { day, month } = formatDate(event.date);

  const visibleAvatars = (event.attendees ?? []).slice(0, MAX_VISIBLE);
  const overflow = Math.max(0, event.registered - visibleAvatars.length);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-200 transition-all duration-200 overflow-hidden">
      {/* Image area */}
      <div className="relative aspect-3/2 overflow-hidden pointer-events-none">
        {event.image ? (
          <img
            src={event.image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 "
            alt=""
          />
        ) : (
          <div className={`w-full h-full ${config.gradient}`} />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/38 to-transparent" />

        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${config.pill}`}
        >
          {config.label}
        </div>

        <div className="absolute bottom-3 left-4">
          <div className="text-[28px] font-serif font-medium text-white leading-none">
            {day}
          </div>
          <div className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-1">
            {month}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-4 pb-5">
        <h3 className="text-[14px] font-medium text-slate-900 leading-snug group-hover:text-[#0C447C] transition-colors">
          {event.title}
        </h3>

        <div className="flex gap-4 mt-2.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock size={11} />
            <span>{event.time || "Scheduled"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <MapPin size={11} />
            <span className="truncate max-w-30">{event.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              {visibleAvatars.map((a, i) => (
                <div
                  key={a.id}
                  style={{ marginLeft: i === 0 ? 0 : -6, zIndex: i }}
                  className={`relative w-6 h-6 rounded-full border-[1.5px] border-white flex items-center justify-center text-[9px] font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                >
                  {a.initials}
                </div>
              ))}
              {overflow > 0 && (
                <div
                  style={{ marginLeft: visibleAvatars.length > 0 ? -6 : 0 }}
                  className="relative w-6 h-6 rounded-full border-[1.5px] border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500"
                >
                  +{overflow > 99 ? "99" : overflow}
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              <span className="font-bold text-slate-600">
                {event.registered}
              </span>{" "}
              / {event.attendanceCap} going
            </span>
          </div>

          {!past && (
            <button
              onClick={() => onToggleRegister(event)}
              disabled={loading || (isFull && !event.isRegistered)}
              className={`px-4.5 py-1.75 rounded-[10px] text-[11px] font-bold tracking-wide transition-all duration-150 ${
                event.isRegistered
                  ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  : isFull
                    ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                    : "bg-[#0C447C] text-white hover:bg-[#185FA5]"
              }`}
            >
              {loading
                ? "..."
                : event.isRegistered
                  ? "Going"
                  : isFull
                    ? "Full"
                    : "Join"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
