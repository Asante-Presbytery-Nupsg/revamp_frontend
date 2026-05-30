import type { FeedbackItem, FeedbackStatus } from "@/api/feedback.api";
import {
  Eye,
  Loader2,
  LockIcon,
  Send,
  Star,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { CATEGORY_LABELS, STATUS_CONFIG } from "./feedback.config";
import { formatDate } from "@/lib/utils";

const DetailDrawer: React.FC<{
  item: FeedbackItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: FeedbackStatus) => void;
  onUpdateNote: (id: string, note: string) => void;
  onDelete: (id: string) => void;
  updating: boolean;
  deleting: boolean;
}> = ({
  item,
  onClose,
  onUpdateStatus,
  onUpdateNote,
  onDelete,
  updating,
  deleting,
}) => {
  const [note, setNote] = useState(item?.adminNote ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!item) return null;

  const style = STATUS_CONFIG[item.status];
  const nextStatus: FeedbackStatus | null =
    item.status === "received"
      ? "reviewed"
      : item.status === "reviewed"
        ? "actioned"
        : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed h-full inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-110 bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">
              Feedback Detail
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatDate(item.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-[#185FA5] bg-[#E6F1FB] px-2.5 py-0.5 rounded-full">
              {CATEGORY_LABELS[item.category]}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
            >
              {style.icon} {style.label}
            </span>
            {item.anonymous && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <LockIcon size={9} /> Anonymous
              </span>
            )}
          </div>

          {/* Submitter */}
          {item.submitterName && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E6F1FB] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#185FA5]">
                  {item.submitterName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-900">
                  {item.submitterName}
                </p>
                <p className="text-[11px] text-slate-400">
                  {item.anonymous
                    ? "Anonymous submission (admin view)"
                    : "Submitter"}
                </p>
              </div>
            </div>
          )}

          {/* Rating */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Rating
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  className={
                    s <= item.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 fill-slate-200"
                  }
                />
              ))}
              <span className="text-[12px] text-slate-500 ml-1.5">
                {item.rating}/5
              </span>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Message
            </p>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                {item.message}
              </p>
            </div>
          </div>

          {/* Admin note */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Admin Note
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add internal notes..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-300 resize-none leading-relaxed"
            />
            {note !== (item.adminNote ?? "") && (
              <button
                onClick={() => onUpdateNote(item.id, note)}
                disabled={updating}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#185FA5] bg-[#E6F1FB] rounded-lg hover:bg-[#d0e5f7] transition-colors disabled:opacity-50"
              >
                {updating ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Send size={11} />
                )}
                Save note
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 space-y-2.5">
          {nextStatus && (
            <button
              onClick={() => onUpdateStatus(item.id, nextStatus)}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                         text-white text-[13px] font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {updating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : nextStatus === "reviewed" ? (
                <Eye size={14} />
              ) : (
                <Zap size={14} />
              )}
              Mark as {STATUS_CONFIG[nextStatus].label}
            </button>
          )}

          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(item.id)}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700
                           text-white text-[13px] font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Confirm delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50
                         text-[12px] font-medium rounded-xl transition-colors"
            >
              <Trash2 size={12} />
              Delete
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default DetailDrawer;
