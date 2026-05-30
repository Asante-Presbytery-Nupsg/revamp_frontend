import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import type { PendingShepherd, DrawerContent } from "./types";
import { ini } from "./helpers";
import { formatDate } from "@/lib/utils";

interface Props {
  pending: PendingShepherd[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onOpenDrawer: (c: DrawerContent) => void;
}

const PendingApprovals: React.FC<Props> = ({
  pending,
  onApprove,
  onDecline,
  onOpenDrawer,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 210 : -210,
      behavior: "smooth",
    });

  if (pending.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
              <Clock size={12} className="text-slate-400" />
              <span className="text-[12px] text-slate-500">Pending review</span>
            </div>
            <span
              className="inline-flex items-center justify-center min-w-5 h-5 px-1.5
                             bg-[#0C447C] text-[#E6F1FB] text-[11px] font-medium rounded-full"
            >
              {pending.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200
                         bg-white text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200
                         bg-white text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto pb-1 scroll-smooth"
          style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
        >
          {pending.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenDrawer({ kind: "pending", data: p })}
              className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex flex-col gap-2
                         shrink-0 w-50 cursor-pointer hover:border-slate-200 transition-all"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-8 h-8 rounded-full border border-slate-400 bg-[#E6F1FB] flex items-center justify-center
                                text-[11px] font-medium text-[#0C447C] shrink-0"
                >
                  {ini(p.firstName + " " + p.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-slate-900 truncate">
                    {p.firstName + " " + p.lastName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {p.shortName} · {p.programme}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock size={9} />
                <span>Applied {formatDate(p.createdAt)}</span>
              </div>

              <div
                className="flex gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onApprove(p.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg
                             bg-green-50 text-green-700 text-[11px] font-medium
                             hover:bg-green-100 transition-colors"
                >
                  <CheckCircle2 size={10} /> Approve
                </button>
                <button
                  onClick={() => onDecline(p.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg
                             bg-white border border-slate-200 text-slate-500 text-[11px] font-medium
                             hover:bg-slate-50 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
          <div className="shrink-0 w-1" />
        </div>
      </div>
    </motion.div>
  );
};
export default PendingApprovals;
