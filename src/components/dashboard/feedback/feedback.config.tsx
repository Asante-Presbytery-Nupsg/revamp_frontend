import type { FeedbackCategory, FeedbackStatus } from "@/api/feedback.api";
import { CheckCircle2, Eye, MessageSquare } from "lucide-react";

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  received: {
    label: "Received",
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: <MessageSquare size={11} />,
  },
  reviewed: {
    label: "Reviewed",
    bg: "bg-blue-50",
    text: "text-[#185FA5]",
    icon: <Eye size={11} />,
  },
  actioned: {
    label: "Actioned",
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <CheckCircle2 size={11} />,
  },
};

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  general: "General",
  shepherd: "Shepherd",
  events: "Events",
  programme: "Programme",
  facilities: "Facilities",
  suggestion: "Suggestion",
};

const STATUS_OPTIONS: FeedbackStatus[] = ["received", "reviewed", "actioned"];
const CATEGORY_OPTIONS: FeedbackCategory[] = [
  "general",
  "shepherd",
  "events",
  "programme",
  "facilities",
  "suggestion",
];

export { STATUS_CONFIG, STATUS_OPTIONS, CATEGORY_LABELS, CATEGORY_OPTIONS };
