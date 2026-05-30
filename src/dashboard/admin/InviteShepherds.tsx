"use no memo";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Copy,
  CheckCircle2,
  RefreshCw,
  Link,
  Mail,
  Loader2,
} from "lucide-react";
import { BASE_URL, STATUS_MAP } from "@/components/dashboard/invite/inviteData";
import { InviteActions } from "@/components/dashboard/invite/InviteActions";
import type { InviteStatus } from "@/api/invites.api";
import {
  useInvites,
  useSendInvite,
  useRevokeInvite,
  useResendInvite,
  useDeleteInvite,
} from "@/hooks/queries/useInvites";

const STATUS_TABS = ["All", "pending", "used", "expired"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const InviteShepherds: React.FC = () => {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<StatusTab>("All");
  const [justSent, setJustSent] = useState(false);

  const { data, isLoading } = useInvites({
    status: statusTab === "All" ? undefined : (statusTab as InviteStatus),
    limit: 50,
  });

  const invites = data?.data ?? [];
  const sendInvite = useSendInvite();
  const revokeInvite = useRevokeInvite();
  const resendInvite = useResendInvite();
  const deleteInvite = useDeleteInvite();

  const pendingCount = invites.filter((i) => i.status === "pending").length;
  const usedCount = invites.filter((i) => i.status === "used").length;

  const handleSend = () => {
    if (!email.trim()) return;
    sendInvite.mutate(email.trim(), {
      onSuccess: () => {
        setEmail("");
        setJustSent(true);
        setTimeout(() => setJustSent(false), 3000);
      },
    });
  };

  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(`${BASE_URL}?token=${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[24px] sm:text-[28px] tracking-tight leading-tight">
          Invite Shepherds
        </h1>
        <p className="text-[12px] sm:text-[13px] font-light text-slate-400 mt-0.5">
          Send invite links to onboard new shepherds
        </p>
      </div>

      {/* Send invite card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#E6F1FB] flex items-center justify-center shrink-0">
            <Link size={15} className="text-[#185FA5]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-900">
              Send Invite Link
            </p>
            <p className="text-[11px] text-slate-400">
              Link expires in 7 days · single use
            </p>
          </div>
        </div>

        {/* Input + button — stacks on mobile */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Mail
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="shepherd@email.com"
              type="email"
              className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-300"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!email.trim() || sendInvite.isPending}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                       text-white text-[13px] font-medium rounded-xl transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed sm:shrink-0"
          >
            {sendInvite.isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={14} />
              </motion.div>
            ) : justSent ? (
              <>
                <CheckCircle2 size={14} /> Sent!
              </>
            ) : (
              <>
                <Send size={14} /> Send Invite
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 flex-wrap">
          <Link size={10} className="shrink-0" />
          <span className="hidden sm:inline">Link format:</span>
          <span className="font-mono text-slate-500 truncate">
            {BASE_URL}?token=...
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            label: "Total Sent",
            value: data?.total ?? invites.length,
            color: "text-[#0C447C]",
          },
          { label: "Pending", value: pendingCount, color: "text-amber-600" },
          { label: "Accepted", value: usedCount, color: "text-green-600" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center"
          >
            <p
              className={`font-serif text-[22px] sm:text-[28px] font-light leading-none tracking-tight ${color}`}
            >
              {value}
            </p>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5 leading-tight">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Invites table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Tabs — scrollable on mobile */}
        <div
          className="flex items-center gap-1 px-4 sm:px-5 py-3.5 border-b border-slate-100 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all capitalize whitespace-nowrap ${
                  statusTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="text-slate-300 animate-spin" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {invites.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-[13px] font-light text-slate-400">
                    No {statusTab === "All" ? "" : statusTab} invites.
                  </p>
                </div>
              ) : (
                invites.map((invite) => {
                  const style = STATUS_MAP[invite.status];
                  return (
                    <motion.div
                      key={invite.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                        {/* Top row — email + status badge */}
                        <div className="flex items-center justify-between gap-3 min-w-0">
                          <p className="text-[13px] font-medium text-slate-900 truncate flex-1 min-w-0">
                            {invite.email}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}
                            >
                              {style.icon} {style.label}
                            </span>
                            <InviteActions
                              invite={invite}
                              onCopyLink={() => handleCopyLink(invite.token)}
                              onRevoke={() => revokeInvite.mutate(invite.id)}
                              onResend={() => resendInvite.mutate(invite.id)}
                              onDelete={() => deleteInvite.mutate(invite.id)}
                            />
                          </div>
                        </div>

                        {/* Bottom row — dates + copy link */}
                        <div className="flex items-center justify-between mt-1.5 gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] text-slate-400">
                              Sent {fmtDate(invite.createdAt)}
                            </span>
                            <span className="text-[11px] text-slate-300 hidden sm:inline">
                              ·
                            </span>
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                              Expires {fmtDate(invite.expiresAt)}
                            </span>
                          </div>

                          {invite.status === "pending" && (
                            <button
                              onClick={() => handleCopyLink(invite.token)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200
                                         hover:bg-slate-50 transition-colors shrink-0"
                            >
                              {copied === invite.token ? (
                                <>
                                  <CheckCircle2
                                    size={11}
                                    className="text-green-500"
                                  />
                                  <span className="text-[11px] text-green-600">
                                    Copied!
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} className="text-slate-400" />
                                  <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                                    {invite.token.slice(0, 10)}...
                                  </span>
                                  <span className="text-[11px] text-slate-500 sm:hidden">
                                    Copy link
                                  </span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteShepherds;
