import type { InviteStatus } from "@/api/invites.api";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export type Invite = {
  id: string;
  email: string;
  sentDate: string;
  expiresDate: string;
  status: InviteStatus;
  token: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const BASE_URL = "https://nupsg.org/register/shepherd";

export const STATUS_MAP: Record<
  InviteStatus,
  { bg: string; text: string; icon: React.ReactNode; label: string }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: <Clock size={11} />,
    label: "Pending",
  },
  used: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <CheckCircle2 size={11} />,
    label: "Used",
  },
  expired: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    icon: <XCircle size={11} />,
    label: "Expired",
  },
  revoked: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    icon: <XCircle size={11} />,
    label: "Revoked",
  },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_INVITES: Invite[] = [
  {
    id: "1",
    email: "e.osei@gmail.com",
    sentDate: "Mar 26, 2026",
    expiresDate: "Apr 2, 2026",
    status: "pending",
    token: "tok_abc123",
  },
  {
    id: "2",
    email: "g.adjei@gmail.com",
    sentDate: "Mar 25, 2026",
    expiresDate: "Apr 1, 2026",
    status: "pending",
    token: "tok_def456",
  },
  {
    id: "3",
    email: "d.frimpong@gmail.com",
    sentDate: "Mar 23, 2026",
    expiresDate: "Mar 30, 2026",
    status: "pending",
    token: "tok_ghi789",
  },
  {
    id: "4",
    email: "ama.owusu@gmail.com",
    sentDate: "Jan 3, 2026",
    expiresDate: "Jan 10, 2026",
    status: "used",
    token: "tok_jkl012",
  },
  {
    id: "5",
    email: "kojo.m@gmail.com",
    sentDate: "Jan 6, 2026",
    expiresDate: "Jan 13, 2026",
    status: "used",
    token: "tok_mno345",
  },
  {
    id: "6",
    email: "old.invite@gmail.com",
    sentDate: "Dec 1, 2025",
    expiresDate: "Dec 8, 2025",
    status: "expired",
    token: "tok_pqr678",
  },
];
