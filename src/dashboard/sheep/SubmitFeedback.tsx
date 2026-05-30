import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Lock, Loader2 } from "lucide-react";
import {
  CATEGORIES,
  type FeedbackCategory,
} from "@/components/sheep/feedback/feedbackData";
import { StarRating } from "@/components/sheep/feedback/StarRating";
import { FeedbackSuccess } from "@/components/sheep/feedback/FeedbackSuccess";
import { PastFeedbackList } from "@/components/sheep/feedback/PastFeedbackList";
import { useCreateFeedback } from "@/hooks/queries/useFeedback";
import { useMyProfile } from "@/hooks/queries/useSheepProfile";

const SubmitFeedback: React.FC = () => {
  const { data: profile } = useMyProfile();
  const createFeedback = useCreateFeedback();

  const [category, setCategory] = useState<FeedbackCategory>("general");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = message.trim().length >= 10 && rating > 0;
  const submitting = createFeedback.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createFeedback.mutate(
      { category, rating, message: message.trim(), anonymous },
      {
        onSuccess: () => setSubmitted(true),
      },
    );
  };

  const reset = () => {
    setCategory("general");
    setRating(0);
    setMessage("");
    setAnonymous(false);
    setSubmitted(false);
  };

  if (submitted)
    return <FeedbackSuccess anonymous={anonymous} onReset={reset} />;

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "you";

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto px-1.5 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight">
          Submit Feedback
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Help us improve your experience as a member
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
          <h3 className="text-[15px] font-semibold text-slate-900">
            New Feedback
          </h3>
        </div>

        <div className="px-5 sm:px-6 py-5 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    category === value
                      ? "border-[#185FA5] bg-[#E6F1FB]"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-[12px] font-semibold ${category === value ? "text-[#185FA5]" : "text-slate-700"}`}
                  >
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Overall Rating
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts, suggestions, or concerns..."
              rows={5}
              className="w-full px-4 py-3 text-[13px] border border-slate-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-300 resize-none leading-relaxed"
            />
            <p
              className={`text-[11px] mt-1 ${message.length < 10 && message.length > 0 ? "text-amber-500" : "text-slate-400"}`}
            >
              {message.length < 10 && message.length > 0
                ? `${10 - message.length} more characters needed`
                : `${message.length} characters`}
            </p>
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
            <button
              onClick={() => setAnonymous((o) => !o)}
              className={`w-10 h-6 rounded-full relative transition-colors duration-200 shrink-0 mt-0.5 ${
                anonymous ? "bg-[#0C447C]" : "bg-slate-200"
              }`}
            >
              <motion.div
                animate={{ x: anonymous ? 18 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <Lock size={12} className="text-slate-500" />
                <p className="text-[13px] font-semibold text-slate-900">
                  Submit anonymously
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Your name will not be attached to this feedback. Only the admin
                and your shepherd can see submissions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-slate-100
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <p className="text-[11px] text-slate-400 order-2 sm:order-1">
            {anonymous ? "Submitting anonymously" : `Submitting as ${fullName}`}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2
                       px-6 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium
                       rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>

      <PastFeedbackList />
    </div>
  );
};

export default SubmitFeedback;
