import { Clock, MapPin, Ticket, CheckCircle2 } from "lucide-react";
import {
  TYPE_CONFIG,
  isPast,
  formatDate,
  type ShepherdEvent,
} from "./shepherdEventsData";

// ─── Component ────────────────────────────────────────────────────────────────

export const ShepherdEventCard: React.FC<{ event: ShepherdEvent }> = ({
  event,
}) => {
  const config = TYPE_CONFIG[event.type];
  const past = isPast(event.dateISO);
  const spotsLeft = event.attendanceCap - event.registered;
  const when = formatDate(event.dateISO, event.date);

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden transition-all ${
        event.isRegistered
          ? "border-[#185FA5]/25 shadow-sm shadow-gray-100"
          : "border-slate-100 hover:border-slate-200"
      }`}
    >
      <div className="flex items-stretch">
        {/* Left image / gradient */}
        <div className="relative w-22.5 sm:w-45 shrink-0">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-linear-to-br ${config.gradient} min-h-30`}
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`w-2 h-2 rounded-full block ${config.dot} ring-2 ring-white/40`}
            />
          </div>
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center">
            <span className="text-[9px] font-bold text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">
              {event.date.split(",")[0]}
            </span>
          </div>
        </div>

        {/* Right details */}
        <div className="flex-1 min-w-0 p-3.5 flex flex-col gap-2">
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${config.badge}`}
            >
              {config.label}
            </span>
            {past ? (
              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Past
              </span>
            ) : event.isRegistered ? (
              <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={9} /> Registered
              </span>
            ) : null}
          </div>

          <h3 className="text-[13px] font-semibold text-slate-900 leading-tight line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock size={10} className="text-slate-400 shrink-0" />
              <span
                className={
                  !past && when !== event.date
                    ? "font-semibold text-[#185FA5]"
                    : ""
                }
              >
                {when}
                {event.time ? ` · ${event.time}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <MapPin size={10} className="text-slate-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Ticket size={10} className="text-slate-300 shrink-0" />
              <span>
                {event.registered}/{event.attendanceCap}
              </span>
              {!past && spotsLeft <= 30 && spotsLeft > 0 && (
                <span className="text-red-500 font-semibold">
                  {spotsLeft} left
                </span>
              )}
              {!past && spotsLeft <= 0 && (
                <span className="text-red-500 font-semibold">Full</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShepherdEventCard;
