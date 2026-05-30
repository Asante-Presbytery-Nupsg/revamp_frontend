// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedbackCategory =
  | "general" | "shepherd" | "events"
  | "programme" | "facilities" | "suggestion";

export type PastFeedback = {
  id: string;
  category: string;
  excerpt: string;
  date: string;
  status: "received" | "reviewed" | "actioned";
  anonymous: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const CATEGORIES: { value: FeedbackCategory; label: string; desc: string }[] = [
  { value: "general",    label: "General",          desc: "Overall experience as a member"        },
  { value: "shepherd",   label: "My Shepherd",      desc: "Feedback about your shepherd"          },
  { value: "events",     label: "Events & Meetings", desc: "Comment on events or bible studies"   },
  { value: "programme",  label: "Programme Content", desc: "Topics, themes, and discussions"      },
  { value: "facilities", label: "Facilities",        desc: "Venues, resources, logistics"         },
  { value: "suggestion", label: "Suggestion",        desc: "Ideas for improvement"                },
];

export const STATUS_STYLES: Record<
  PastFeedback["status"],
  { label: string; bg: string; text: string }
> = {
  received: { label: "Received", bg: "bg-slate-100", text: "text-slate-500"  },
  reviewed: { label: "Reviewed", bg: "bg-blue-50",   text: "text-[#185FA5]"  },
  actioned: { label: "Actioned", bg: "bg-green-50",  text: "text-green-700"  },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const PAST_FEEDBACK: PastFeedback[] = [
  { id: "1", category: "Events",     excerpt: "The bible study was really impactful. Would love more sessions like this...",                      date: "Mar 10, 2026", status: "actioned", anonymous: false },
  { id: "2", category: "Programme",  excerpt: "Could we have more career-oriented discussions for final year students?",                          date: "Feb 2, 2026",  status: "reviewed", anonymous: true  },
  { id: "3", category: "Suggestion", excerpt: "It would be great if we had a group chat for all members in the same hostel.",                    date: "Jan 15, 2026", status: "received", anonymous: false },
];
