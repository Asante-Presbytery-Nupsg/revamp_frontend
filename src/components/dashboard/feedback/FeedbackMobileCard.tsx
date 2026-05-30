import { Lock, Star } from "lucide-react";
import { CATEGORY_LABELS, STATUS_CONFIG } from "./feedback.config";
import type { FeedbackItem } from "@/api/feedback.api";
import { formatDate } from "@/lib/utils";

const FeedbackMobileCard: React.FC<{
  item: FeedbackItem;
  onClick: () => void;
}> = ({ item, onClick }) => {
  const style = STATUS_CONFIG[item.status];
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-all active:scale-[0.99] space-y-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {item.anonymous ? (
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Lock size={10} className="text-slate-400" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-[#185FA5]">
                {(item.submitterName ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
          <span className="text-[13px] font-medium text-slate-800 truncate">
            {item.anonymous ? "Anonymous" : (item.submitterName ?? "—")}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${style.bg} ${style.text}`}
        >
          {style.icon} {style.label}
        </span>
      </div>

      {/* Category + rating */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#185FA5] bg-[#E6F1FB] px-2 py-0.5 rounded-full">
          {CATEGORY_LABELS[item.category]}
        </span>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={10}
              className={
                s <= item.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200 fill-slate-200"
              }
            />
          ))}
        </div>
      </div>

      {/* Message */}
      <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed">
        {item.message}
      </p>

      {/* Date */}
      <p className="text-[10px] text-slate-400">{formatDate(item.createdAt)}</p>
    </button>
  );
};

export default FeedbackMobileCard;
