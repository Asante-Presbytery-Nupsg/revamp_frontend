import { useEvents } from "@/hooks/queries/useEvents";
import ModalShell from "./ModalShell";
import { Calendar, Clock, Loader2, MapPinIcon } from "lucide-react";

const MyScheduleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data, isLoading } = useEvents({ status: "upcoming", limit: 50 });
  const registered = (data?.data ?? []).filter((e) => e.isRegistered);

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-GH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <ModalShell
      title="My Schedule"
      subtitle="Events you're registered for"
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : registered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Calendar size={28} className="text-slate-200 mb-3" />
          <p className="text-[14px] text-slate-400 font-light">
            No upcoming events registered
          </p>
          <p className="text-[12px] text-slate-400 mt-1">
            Head to the Events tab to browse and register
          </p>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-3">
          {registered.map((e) => (
            <div
              key={e.id}
              className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E6F1FB] flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-[#185FA5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 truncate">
                  {e.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Clock size={10} /> {fmt(e.date)}
                </p>
                {e.location && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPinIcon size={10} /> {e.location}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                Registered
              </span>
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
};

export default MyScheduleModal;
