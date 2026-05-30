import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Megaphone, ChevronRight } from "lucide-react";
import type { Notice } from "./sheepData";

export const NoticeCard: React.FC<{
  notice: Notice;
  onRead: () => void;
}> = ({ notice, onRead }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
    if (notice.unread) onRead();
  };

  return (
    <motion.div
      layout
      onClick={handleClick}
      className={`relative p-5 cursor-pointer border-b border-slate-100 last:border-0 transition-colors duration-200 ${
        open
          ? "bg-slate-50/80"
          : notice.unread
            ? "bg-[#0C447C]/2"
            : "hover:bg-slate-50/60"
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <motion.div
          animate={
            notice.priority === "urgent"
              ? {}
              : open
                ? {
                    borderColor: "#0C447C",
                    backgroundColor: "#E6F1FB",
                    color: "#0C447C",
                  }
                : {
                    borderColor: "rgb(226,232,240)",
                    backgroundColor: "white",
                    color: "#94a3b8",
                  }
          }
          transition={{ duration: 0.2 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
            notice.priority === "urgent"
              ? "bg-red-50 border-red-100 text-red-500"
              : ""
          }`}
        >
          {notice.priority === "urgent" ? (
            <Bell size={16} />
          ) : (
            <Megaphone size={16} />
          )}
        </motion.div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h4
                className={`text-[14px] leading-snug ${
                  notice.unread && !open
                    ? "font-bold text-slate-900"
                    : "font-medium text-slate-600"
                }`}
              >
                {notice.title}
              </h4>
              {notice.unread && !open && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0C447C] shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                {notice.date}
              </span>
              <motion.div
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <ChevronRight size={14} className="text-slate-300" />
              </motion.div>
            </div>
          </div>

          {/* Animated expanded body */}
          <motion.div
            initial={false}
            animate={
              open
                ? { height: "auto", opacity: 1, marginTop: 8 }
                : { height: 0, opacity: 0, marginTop: 0 }
            }
            transition={{
              height: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.22, delay: open ? 0.08 : 0 },
              marginTop: { duration: 0.25 },
            }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-[13px] text-slate-500 leading-relaxed">
              {notice.body}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                {notice.from.charAt(0)}
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {notice.from}
              </span>
            </div>
          </motion.div>

          {/* From row preview — only visible when collapsed */}
          <motion.div
            animate={
              open
                ? { opacity: 0, height: 0, marginTop: 0 }
                : { opacity: 1, height: "auto", marginTop: 10 }
            }
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                {notice.from.charAt(0)}
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {notice.from}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
