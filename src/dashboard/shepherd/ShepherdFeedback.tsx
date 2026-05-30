"use no memo";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  Star,
  Clock,
  RotateCcw,
  Lock,
  Building2,
  Users,
} from "lucide-react";
import { useMySheep } from "@/hooks/queries/useShepherds";
import {
  useCreateFeedback,
  useCreateShepherdFeedback,
  useMyFeedback,
  useMyShepherdFeedback,
} from "@/hooks/queries/useFeedback";
import { StarRating } from "@/components/sheep/feedback/StarRating";
import type { MySheep } from "@/api/shepherd.api";
import type {
  FeedbackCategory,
  FeedbackItem,
  CreateFeedbackInput,
  CreateShepherdFeedbackInput,
} from "@/api/feedback.api";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type FeedbackMode = "platform" | "sheep";

type CategoryConfig = {
  value: FeedbackCategory;
  label: string;
  desc: string;
};

type FormState = {
  mode: FeedbackMode;
  sheepId: string;
  category: FeedbackCategory;
  rating: number;
  message: string;
  anonymous: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORM_CATEGORIES: CategoryConfig[] = [
  { value: "general", label: "General", desc: "Overall experience" },
  { value: "shepherd", label: "Shepherding", desc: "Shepherd system & tools" },
  { value: "events", label: "Events", desc: "Events & programmes" },
  { value: "programme", label: "Programme", desc: "Academic integration" },
  { value: "facilities", label: "Facilities", desc: "Venues & resources" },
  { value: "suggestion", label: "Suggestion", desc: "Ideas & improvements" },
];

const SHEEP_CATEGORIES: CategoryConfig[] = [
  { value: "attendance", label: "Attendance", desc: "Meeting consistency" },
  {
    value: "engagement",
    label: "Engagement",
    desc: "Participation & activity",
  },
  {
    value: "spiritual_growth",
    label: "Spiritual Growth",
    desc: "Faith development",
  },
  { value: "conduct", label: "Conduct", desc: "Behaviour & attitude" },
  { value: "general", label: "General", desc: "Overall observations" },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  received: { label: "Received", color: "text-slate-500", dot: "bg-slate-300" },
  reviewed: { label: "Reviewed", color: "text-blue-600", dot: "bg-blue-400" },
  actioned: { label: "Actioned", color: "text-green-600", dot: "bg-green-500" },
};

const EMPTY_FORM: FormState = {
  mode: "platform",
  sheepId: "",
  category: "general",
  rating: 0,
  message: "",
  anonymous: false,
};

// ─── PastFeedbackCard ─────────────────────────────────────────────────────────

const PastFeedbackCard: React.FC<{
  item: FeedbackItem;
  mode: FeedbackMode;
}> = ({ item, mode }) => {
  const categories = mode === "sheep" ? SHEEP_CATEGORIES : PLATFORM_CATEGORIES;
  const cat = categories.find((c) => c.value === item.category);
  const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG["received"]!;

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {mode === "sheep" && item.targetName && (
            <p className="text-[13px] font-semibold text-slate-900 truncate">
              {item.targetName}
            </p>
          )}
          <p className="text-[11px] text-slate-400 mt-0.5">
            {cat?.label ?? item.category}
          </p>
        </div>
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold shrink-0 ${status.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={13}
            className={
              i < item.rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"
            }
          />
        ))}
      </div>

      <p className="text-[12px] text-slate-600 leading-relaxed line-clamp-3">
        {item.message}
      </p>

      {item.adminNote && (
        <div className="bg-[#E6F1FB] rounded-xl p-3">
          <p className="text-[10px] font-semibold text-[#185FA5] uppercase tracking-wider mb-1">
            Admin note
          </p>
          <p className="text-[12px] text-[#0C447C] leading-relaxed">
            {item.adminNote}
          </p>
        </div>
      )}

      <p className="text-[10px] text-slate-400 flex items-center gap-1">
        <Clock size={10} />
        {new Date(item.createdAt).toLocaleDateString("en-GH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ShepherdFeedback: React.FC = () => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [pastMode, setPastMode] = useState<FeedbackMode>("platform");

  const { data: sheepPage, isLoading: sheepLoading } = useMySheep({
    limit: 100,
  });
  const { data: pastPlatform, isLoading: pastPlatformLoading } = useMyFeedback({
    limit: 20,
  });
  const { data: pastSheep, isLoading: pastSheepLoading } =
    useMyShepherdFeedback({ limit: 20 });

  const createPlatformFeedback = useCreateFeedback();
  const createSheepFeedback = useCreateShepherdFeedback();

  const sheep = useMemo<MySheep[]>(() => sheepPage?.data ?? [], [sheepPage]);

  const selectedSheep = useMemo<MySheep | undefined>(
    () => sheep.find((s) => s.id === form.sheepId),
    [sheep, form.sheepId],
  );

  const categories =
    form.mode === "platform" ? PLATFORM_CATEGORIES : SHEEP_CATEGORIES;

  const canSubmit =
    form.rating > 0 &&
    form.message.trim().length >= 10 &&
    (form.mode === "platform" || form.sheepId.length > 0);

  const isPending =
    createPlatformFeedback.isPending || createSheepFeedback.isPending;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const switchMode = (mode: FeedbackMode) =>
    setForm({
      ...EMPTY_FORM,
      mode,
      category: mode === "sheep" ? "attendance" : "general",
    });

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (form.mode === "platform") {
      const input: CreateFeedbackInput = {
        category: form.category,
        rating: form.rating,
        message: form.message.trim(),
        anonymous: form.anonymous,
      };
      createPlatformFeedback.mutate(input, {
        onSuccess: () => {
          setSubmitted(true);
          toast.success("Feedback sent successfully");
        },
      });
    } else {
      const input: CreateShepherdFeedbackInput = {
        category: form.category,
        rating: form.rating,
        message: form.message.trim(),
      };
      createSheepFeedback.mutate(
        { sheepId: form.sheepId, input },
        {
          onSuccess: () => {
            setSubmitted(true);
            toast.success("Feedback sent successfully");
          },
        },
      );
    }
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setSubmitted(false);
  };

  const pastItems =
    pastMode === "platform"
      ? (pastPlatform?.data ?? [])
      : (pastSheep?.data ?? []);
  const pastLoading =
    pastMode === "platform" ? pastPlatformLoading : pastSheepLoading;

  // ── Success ──────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={32} className="text-green-500" />
        </motion.div>
        <h2 className="font-serif font-light text-[#0c0d0e] text-[24px] sm:text-[28px] tracking-tight mb-2">
          Feedback submitted.
        </h2>
        <p className="text-[13px] sm:text-[14px] font-light text-slate-400 max-w-xs mb-8">
          {form.mode === "sheep" && selectedSheep
            ? `Your feedback on ${selectedSheep.firstName} ${selectedSheep.lastName} has been recorded.`
            : "Your platform feedback has been recorded."}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                     text-white text-[13px] font-medium rounded-xl transition-colors"
        >
          <RotateCcw size={13} /> Submit another
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-0 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[24px] sm:text-[28px] tracking-tight">
          Submit Feedback
        </h1>
        <p className="text-[12px] sm:text-[13px] font-light text-slate-400 mt-0.5">
          Share feedback about the platform or a member in your care
        </p>
      </div>

      {/* Mode toggle — stacked on mobile, side by side on sm+ */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
        {(["platform", "sheep"] as FeedbackMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => switchMode(mode)}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border text-left transition-all ${
              form.mode === mode
                ? "border-[#185FA5] bg-[#E6F1FB]"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                form.mode === mode ? "bg-[#185FA5]" : "bg-slate-100"
              }`}
            >
              {mode === "platform" ? (
                <Building2
                  size={15}
                  className={
                    form.mode === mode ? "text-white" : "text-slate-500"
                  }
                />
              ) : (
                <Users
                  size={15}
                  className={
                    form.mode === mode ? "text-white" : "text-slate-500"
                  }
                />
              )}
            </div>
            <div className="min-w-0">
              <p
                className={`text-[13px] font-semibold truncate ${form.mode === mode ? "text-[#185FA5]" : "text-slate-800"}`}
              >
                {mode === "platform" ? "Platform" : "About a Member"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">
                {mode === "platform"
                  ? "Events, programme, suggestions"
                  : "Observations on a sheep"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <h3 className="text-[14px] sm:text-[15px] font-semibold text-slate-900">
            {form.mode === "platform" ? "Platform Feedback" : "Member Feedback"}
          </h3>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-5 sm:space-y-6">
          {/* Sheep selector — sheep mode only, animated */}
          <AnimatePresence initial={false}>
            {form.mode === "sheep" && (
              <motion.div
                key="sheep-selector"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pb-1">
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Member
                  </label>
                  {sheepLoading ? (
                    <div className="flex items-center gap-2 text-[13px] text-slate-400 py-2">
                      <Loader2 size={14} className="animate-spin" /> Loading
                      members…
                    </div>
                  ) : sheep.length === 0 ? (
                    <p className="text-[13px] text-slate-400">
                      No members assigned yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sheep.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => set("sheepId", s.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            form.sheepId === s.id
                              ? "border-[#185FA5] bg-[#E6F1FB]"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <p
                            className={`text-[13px] font-semibold truncate ${
                              form.sheepId === s.id
                                ? "text-[#185FA5]"
                                : "text-slate-800"
                            }`}
                          >
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {s.institution ?? "—"} · {s.programme ?? "—"}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => set("category", value)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                    form.category === value
                      ? "border-[#185FA5] bg-[#E6F1FB]"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-[11px] sm:text-[12px] font-semibold leading-tight ${
                      form.category === value
                        ? "text-[#185FA5]"
                        : "text-slate-700"
                    }`}
                  >
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug hidden sm:block">
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {form.mode === "platform" ? "Overall Rating" : "Rating"}
            </label>
            <StarRating
              value={form.rating}
              onChange={(v) => set("rating", v)}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              {form.mode === "platform" ? "Your Feedback" : "Observations"}
            </label>
            <textarea
              value={form.message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                set("message", e.target.value)
              }
              placeholder={
                form.mode === "platform"
                  ? "Share your thoughts, suggestions, or concerns about the platform..."
                  : "Describe your observations, progress notes, or concerns about this member..."
              }
              rows={4}
              className="w-full px-3 sm:px-4 py-3 text-[13px] border border-slate-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-300 resize-none leading-relaxed"
            />
            <p
              className={`text-[10px] sm:text-[11px] mt-1 ${
                form.message.length > 0 && form.message.length < 10
                  ? "text-amber-500"
                  : "text-slate-400"
              }`}
            >
              {form.message.length > 0 && form.message.length < 10
                ? `${10 - form.message.length} more characters needed`
                : `${form.message.length} characters`}
            </p>
          </div>

          {/* Anonymous toggle — platform mode only */}
          <AnimatePresence initial={false}>
            {form.mode === "platform" && (
              <motion.div
                key="anon-toggle"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-slate-50 rounded-xl">
                  <button
                    onClick={() => set("anonymous", !form.anonymous)}
                    className={`w-10 h-6 rounded-full relative transition-colors duration-200 shrink-0 mt-0.5 ${
                      form.anonymous ? "bg-[#0C447C]" : "bg-slate-200"
                    }`}
                  >
                    <motion.div
                      animate={{ x: form.anonymous ? 18 : 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
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
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Your name will not be attached to this feedback.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 order-2 sm:order-1 text-center sm:text-left">
            {form.mode === "platform"
              ? form.anonymous
                ? "Submitting anonymously"
                : "Submitting as a shepherd"
              : selectedSheep
                ? `Submitting feedback on ${selectedSheep.firstName} ${selectedSheep.lastName}`
                : "Select a member above"}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="order-1 sm:order-2 flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5
                       bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium
                       rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Send size={14} /> Submit Feedback
              </>
            )}
          </button>
        </div>
      </div>

      {/* Past submissions */}
      <div>
        {/* Section header + segmented control */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-[14px] sm:text-[15px] font-semibold text-slate-900">
            Past Submissions
          </h3>
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
            {(["platform", "sheep"] as FeedbackMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setPastMode(mode)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-all whitespace-nowrap ${
                  pastMode === mode
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {mode === "platform" ? "Platform" : "Members"}
              </button>
            ))}
          </div>
        </div>

        {pastLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="text-slate-300 animate-spin" />
          </div>
        ) : pastItems.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-100">
            <p className="text-[13px] font-light text-slate-400">
              No {pastMode === "platform" ? "platform" : "member"} feedback
              submitted yet.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {pastItems.map((item: FeedbackItem) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <PastFeedbackCard item={item} mode={pastMode} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ShepherdFeedback;
