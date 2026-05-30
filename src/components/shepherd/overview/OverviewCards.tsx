import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, CalendarCheck } from "lucide-react";
import type {
  RecentSessionRow,
  UpcomingEventRow,
} from "@/api/shepherdOverview.api";

// ─── RecentSessions ───────────────────────────────────────────────────────────

export const RecentSessions: React.FC<{ data: RecentSessionRow[] }> = ({
  data,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-[14px] font-semibold text-slate-900">
          Recent Sessions
        </h3>
        <button
          onClick={() => navigate("/dashboard/shepherd/attendance")}
          className="flex items-center gap-1 text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2"
        >
          Take attendance <ArrowRight size={13} />
        </button>
      </div>
      {data.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-[13px] text-slate-400 font-light">
            No sessions recorded yet
          </p>
        </div>
      ) : (
        <div>
          {data.map((s, i) => (
            <div
              key={s.date}
              className={`flex items-center gap-3 px-5 py-3.5 ${i < data.length - 1 ? "border-b border-slate-50" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-900">
                  {s.date}
                </p>
                <p className="text-[11px] text-slate-400">
                  {s.total} members checked in
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                  <CheckCircle2 size={11} /> {s.present}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-red-400">
                  <XCircle size={11} /> {s.absent}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── UpcomingEvents ───────────────────────────────────────────────────────────

const formatEventDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const UpcomingEvents: React.FC<{ data: UpcomingEventRow[] }> = ({
  data,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-[14px] font-semibold text-slate-900">
          Upcoming Events
        </h3>
        <button
          onClick={() => navigate("/dashboard/shepherd/events")}
          className="flex items-center gap-1 text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2"
        >
          See all <ArrowRight size={13} />
        </button>
      </div>
      {data.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-[13px] text-slate-400 font-light">
            No upcoming events
          </p>
        </div>
      ) : (
        <div>
          {data.map((e, i) => (
            <div
              key={e.id}
              className={`flex items-start gap-3 px-5 py-3.5 ${i < data.length - 1 ? "border-b border-slate-50" : ""}`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <CalendarCheck size={14} className="text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-900 truncate">
                  {e.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {formatEventDate(e.date)} · {e.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
