import { MessageSquare, Lock, Loader2 } from "lucide-react";
import { useMyFeedback } from "@/hooks/queries/useFeedback";
import type { FeedbackStatus } from "@/api/feedback.api";

const STATUS_STYLES: Record<
  FeedbackStatus,
  { label: string; bg: string; text: string }
> = {
  received: { label: "Received", bg: "bg-slate-100", text: "text-slate-500" },
  reviewed: { label: "Reviewed", bg: "bg-blue-50", text: "text-[#185FA5]" },
  actioned: { label: "Actioned", bg: "bg-green-50", text: "text-green-700" },
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  shepherd: "My Shepherd",
  events: "Events & Meetings",
  programme: "Programme Content",
  facilities: "Facilities",
  suggestion: "Suggestion",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const truncate = (text: string, n: number) =>
  text.length > n ? `${text.slice(0, n).trim()}...` : text;

export const PastFeedbackList: React.FC = () => {
  const { data: response, isLoading } = useMyFeedback({ limit: 20 });
  const items = response?.data ?? [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
        <h3 className="text-[15px] font-semibold text-slate-900">
          Past Submissions
        </h3>
        <p className="text-[12px] text-slate-400 mt-0.5">
          Your previous feedback
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <MessageSquare
            size={24}
            className="text-slate-200 mx-auto mb-2"
          />
          <p className="text-[13px] text-slate-400 font-light">
            No feedback yet
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Your submissions will appear here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {items.map((item) => {
            const style = STATUS_STYLES[item.status];
            return (
              <div
                key={item.id}
                className="px-5 sm:px-6 py-4 flex items-start gap-3 sm:gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <MessageSquare size={15} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-[#185FA5] bg-[#E6F1FB] px-2 py-0.5 rounded-full">
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </span>
                    {item.anonymous && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Lock size={9} /> Anonymous
                      </span>
                    )}
                    {/* Star rating */}
                    <span className="text-[10px] text-amber-500 font-medium">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {truncate(item.message, 140)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.bg} ${style.text}`}
                >
                  {style.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PastFeedbackList;
