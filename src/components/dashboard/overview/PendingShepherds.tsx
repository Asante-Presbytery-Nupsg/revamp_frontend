import React from "react";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Card from "./Card";
import {
  usePendingShepherds,
  useActivateShepherd,
  useDeactivateShepherd,
} from "@/hooks/queries/useShepherds";

const formatRelative = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHr = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffHr < 1) return "Just now";
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "1d ago";
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-GH", { month: "short", day: "numeric" });
};

const PendingShepherds: React.FC = () => {
  const { data: response, isLoading } = usePendingShepherds();
  const shepherds = response?.data.slice(0, 3) ?? [];

  const approve = useActivateShepherd();
  const reject = useDeactivateShepherd();

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">
            Pending Shepherds
          </h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            {shepherds.length} awaiting approval
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : shepherds.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-[13px] text-slate-400 font-light">
            No pending shepherds
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {shepherds.map((s) => {
            const name = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
            const initials = name
              .split(" ")
              .map((n) => n[0])
              .join("");
            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full border border-slate-400 bg-[#E6F1FB] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-semibold text-[#185FA5]">
                      {initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-slate-900 truncate">
                      {name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {s.shortName ?? "—"} · {s.email ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={10} />
                    <span className="text-[10px]">
                      {formatRelative(s.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => approve.mutate(s.id)}
                      disabled={approve.isPending}
                      className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors disabled:opacity-40"
                      title="Approve"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                    <button
                      onClick={() => reject.mutate(s.id)}
                      disabled={reject.isPending}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 transition-colors disabled:opacity-40"
                      title="Decline"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default PendingShepherds;
