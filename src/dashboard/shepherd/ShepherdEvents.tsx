"use no memo";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin as MapPinIcon,
  Mail,
  User,
  Loader2,
  Plus,
  X,
  Megaphone,
  Send,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  BookOpen,
  Phone,
} from "lucide-react";
import { EventCard } from "@/components/sheep/events/EventCard";
import { NoticeCard } from "@/components/sheep/events/NoticeCard";
import {
  useEvents,
  useRegisterForEvent,
  useUnregisterFromEvent,
} from "@/hooks/queries/useEvents";
import {
  useNotices,
  useShepherdNotices,
  useCreateNotice,
  useDeleteNotice,
  useMarkNoticeRead,
  useMarkAllNoticesRead,
} from "@/hooks/queries/useNotices";
import { useMySheep } from "@/hooks/queries/useShepherds";
import { useAuthStore } from "@/store/useAuthStore";
import type { NupsgEvent } from "@/api/events.api";
import type { NoticePriority } from "@/api/notices.api";
import type { MySheep } from "@/api/shepherd.api";

// ─── Types ────────────────────────────────────────────────────────────────────

const TABS = ["Events", "Notices", "My Broadcasts"] as const;
type Tab = (typeof TABS)[number];

// ─── Shared modal shell ───────────────────────────────────────────────────────

const ModalShell: React.FC<{
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}> = ({ title, subtitle, onClose, children, footer, wide }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <div>
          <h3 className="text-[16px] font-semibold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">{children}</div>

      {footer && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 shrink-0">
          {footer}
        </div>
      )}
    </motion.div>
  </div>
);

// ─── My Schedule Modal ────────────────────────────────────────────────────────

const MyScheduleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data, isLoading } = useEvents({ status: "upcoming", limit: 50 });
  const registered = (data?.data ?? []).filter((e) => e.isRegistered);

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-GH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <ModalShell
      title="My Schedule"
      subtitle="Events you're registered for"
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : registered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Calendar size={28} className="text-slate-200 mb-3" />
          <p className="text-[14px] text-slate-400 font-light">
            No upcoming events registered
          </p>
          <p className="text-[12px] text-slate-400 mt-1">
            Head to the Events tab to register for upcoming events
          </p>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-3">
          {registered.map((e) => (
            <div
              key={e.id}
              className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E6F1FB] flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-[#185FA5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 truncate">
                  {e.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Clock size={10} /> {fmt(e.date)}
                </p>
                {e.location && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPinIcon size={10} /> {e.location}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                Registered
              </span>
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
};

// ─── My Sheep Modal ───────────────────────────────────────────────────────────

const MySheepModal: React.FC<{
  onClose: () => void;
  onViewAll: () => void;
}> = ({ onClose, onViewAll }) => {
  const { data, isLoading } = useMySheep({ limit: 100 });
  const sheep: MySheep[] = data?.data ?? [];

  const ini = (s: MySheep) =>
    `${s.firstName[0] ?? ""}${s.lastName[0] ?? ""}`.toUpperCase();

  return (
    <ModalShell
      title="My Sheep"
      subtitle={`${data?.pagination.total ?? 0} members assigned`}
      onClose={onClose}
      wide
      footer={
        <button
          onClick={() => {
            onClose();
            onViewAll();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                     text-white text-[13px] font-medium rounded-xl transition-colors"
        >
          View full profile page <ChevronRight size={14} />
        </button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : sheep.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <User size={28} className="text-slate-200 mb-3" />
          <p className="text-[14px] text-slate-400 font-light">
            No sheep assigned yet
          </p>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-2">
          {sheep.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#E6F1FB] flex items-center justify-center text-[12px] font-bold text-[#185FA5] shrink-0">
                {ini(s)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 truncate">
                  {s.firstName} {s.lastName}
                </p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  {s.institution && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <GraduationCap size={9} /> {s.institution}
                    </span>
                  )}
                  {s.programme && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <BookOpen size={9} /> {s.programme}
                    </span>
                  )}
                </div>
              </div>
              {s.phoneNumber && (
                <a
                  href={`tel:${s.phoneNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
                >
                  <Phone size={13} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
};

// ─── Contact Admin Modal ──────────────────────────────────────────────────────

const ContactAdminModal: React.FC<{
  onClose: () => void;
  shepherdName: string;
}> = ({ onClose, shepherdName }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const createNotice = useCreateNotice();

  const canSend = subject.trim().length >= 3 && message.trim().length >= 10;

  const handleSend = () => {
    if (!canSend) return;
    createNotice.mutate(
      {
        title: subject.trim(),
        body: message.trim(),
        priority: "normal",
        fromName: `${shepherdName} (Shepherd)`,
        targetRole: "admin",
      },
      { onSuccess: () => setSent(true) },
    );
  };

  return (
    <ModalShell
      title="Contact Admin"
      subtitle="Your message will be sent to the NUPS-G admin team"
      onClose={onClose}
      footer={
        sent ? undefined : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">From: {shepherdName}</p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!canSend || createNotice.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white
                           text-[13px] font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {createNotice.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} /> Send
                  </>
                )}
              </button>
            </div>
          </div>
        )
      }
    >
      {sent ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle2 size={28} className="text-green-500" />
          </div>
          <p className="text-[15px] font-semibold text-slate-900 mb-1">
            Message sent
          </p>
          <p className="text-[13px] text-slate-400">
            The admin team will get back to you shortly.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-5 py-2.5 bg-[#E6F1FB] text-[#185FA5] text-[13px] font-semibold rounded-xl hover:bg-[#d0e5f7] transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Query about attendance records"
              className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message to the admin..."
              rows={5}
              className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-300 resize-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              {message.length > 0 && message.length < 10
                ? `${10 - message.length} more characters needed`
                : `${message.length} characters`}
            </p>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

// ─── Create Notice Modal ──────────────────────────────────────────────────────

const CreateNoticeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    body: string;
    priority: NoticePriority;
  }) => void;
  loading: boolean;
  shepherdName: string;
}> = ({ open, onClose, onSubmit, loading, shepherdName }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<NoticePriority>("normal");

  if (!open) return null;

  const canSubmit = title.trim().length >= 3 && body.trim().length >= 10;

  return (
    <ModalShell
      title="Broadcast to Your Sheep"
      subtitle="Only your assigned members will see this"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Sending as {shepherdName}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                canSubmit &&
                onSubmit({ title: title.trim(), body: body.trim(), priority })
              }
              disabled={!canSubmit || loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white
                         text-[13px] font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send size={14} /> Send
                </>
              )}
            </button>
          </div>
        </div>
      }
    >
      <div className="px-5 py-5 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bible Study this Saturday"
            className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                       transition-colors placeholder:text-slate-300"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your announcement..."
            rows={4}
            className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                       transition-colors placeholder:text-slate-300 resize-none leading-relaxed"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            {body.length > 0 && body.length < 10
              ? `${10 - body.length} more characters needed`
              : `${body.length} characters`}
          </p>
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Priority
          </label>
          <div className="flex gap-2">
            {(["normal", "urgent"] as NoticePriority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 px-4 py-2.5 text-[12px] font-semibold rounded-xl border transition-all ${
                  priority === p
                    ? p === "urgent"
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {p === "normal" ? "Normal" : "Urgent"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

type QuickLinkModal = "schedule" | "sheep" | "contact" | null;

const ShepherdCommunityHub: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Events");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<QuickLinkModal>(null);

  const user = useAuthStore((s) => s.user);
  const shepherdName = user ? `${user.firstName} ${user.lastName}` : "Shepherd";

  const QUICK_LINKS: {
    icon: React.ElementType;
    label: string;
    sub: string;
    action: () => void;
  }[] = [
    {
      icon: Calendar,
      label: "My Schedule",
      sub: "Upcoming events",
      action: () => setActiveModal("schedule"),
    },
    {
      icon: MapPinIcon,
      label: "My Sheep",
      sub: "View assigned members",
      action: () => setActiveModal("sheep"),
    },
    {
      icon: Mail,
      label: "Contact Admin",
      sub: "Send a message",
      action: () => setActiveModal("contact"),
    },
    {
      icon: User,
      label: "My Profile",
      sub: "View & edit",
      action: () => navigate("/dashboard/shepherd/profile"),
    },
  ];

  // ── Events ────────────────────────────────────────────────────────────────

  const { data: eventsPage, isLoading: loadingEvents } = useEvents({
    status: "upcoming",
    limit: 20,
  });
  const events: NupsgEvent[] = eventsPage?.data ?? [];
  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterFromEvent();

  const loadingId = registerMutation.isPending
    ? registerMutation.variables?.eventId
    : unregisterMutation.isPending
      ? (unregisterMutation.variables as string)
      : null;

  const handleToggle = (event: NupsgEvent) => {
    if (event.isRegistered) unregisterMutation.mutate(event.id);
    else registerMutation.mutate({ eventId: event.id });
  };

  // ── Notices ───────────────────────────────────────────────────────────────

  const { data: noticesPage, isLoading: loadingNotices } = useNotices({
    limit: 50,
  });
  const notices = noticesPage?.data ?? [];
  const unreadCount = noticesPage?.unreadCount ?? 0;
  const markRead = useMarkNoticeRead();
  const markAllRead = useMarkAllNoticesRead();

  // ── My Broadcasts ─────────────────────────────────────────────────────────

  const { data: myBroadcastsPage, isLoading: loadingBroadcasts } =
    useShepherdNotices({ limit: 50 });
  const myBroadcasts = myBroadcastsPage?.data ?? [];
  const broadcastCount = myBroadcasts.length;
  const createNotice = useCreateNotice();
  const deleteNotice = useDeleteNotice();

  const handleCreateNotice = (data: {
    title: string;
    body: string;
    priority: NoticePriority;
  }) => {
    createNotice.mutate(
      { ...data, fromName: `${shepherdName} (Shepherd)`, targetRole: "sheep" },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setTab("My Broadcasts");
        },
      },
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-2 space-y-8 sm:space-y-10">
      {/* Header */}
      <header>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight leading-tight">
          Community Hub
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Events · Announcements · Broadcasts
        </p>
      </header>

      {/* Tabs */}
      <div
        className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto w-fit"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-5 sm:px-8 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              tab === t
                ? "bg-white text-[#0C447C] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
            {t === "Notices" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {t === "My Broadcasts" && broadcastCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[9px] font-bold">
                {broadcastCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Events Tab ─────────────────────────────────────────── */}
          {tab === "Events" && (
            <div className="space-y-10">
              {/* Quick Access */}
              <section className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0C447C]">
                    Quick Access
                  </h2>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {QUICK_LINKS.map(({ icon: Icon, label, sub, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="group flex flex-col gap-3 p-4 bg-white rounded-lg border border-slate-100
                                 hover:border-[#B5D4F4] hover:shadow-sm hover:-translate-y-0.5
                                 transition-all duration-200 text-left active:scale-[0.98]"
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-[#E6F1FB] flex items-center justify-center">
                        <Icon size={16} className="text-[#0C447C]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 leading-snug">
                          {label}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {sub}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Upcoming Events */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-[#0C447C]">
                    Upcoming
                  </h2>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>
                {loadingEvents ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2
                      size={20}
                      className="text-slate-300 animate-spin"
                    />
                  </div>
                ) : events.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-[14px] font-light text-slate-400">
                      No upcoming events.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {events.map((e) => (
                      <EventCard
                        key={e.id}
                        event={e}
                        onToggleRegister={() => handleToggle(e)}
                        loading={loadingId === e.id}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ── Notices Tab ─────────────────────────────────────────── */}
          {tab === "Notices" && (
            <div className="max-w-4xl space-y-2 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-100">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Recent Bulletins
                </h2>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-[11px] font-bold text-[#185FA5] hover:underline"
                  >
                    Clear Unread
                  </button>
                )}
              </div>
              {loadingNotices ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={20} className="text-slate-300 animate-spin" />
                </div>
              ) : notices.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-[13px] font-light text-slate-400">
                    No notices yet.
                  </p>
                </div>
              ) : (
                notices.map((n) => (
                  <NoticeCard
                    key={n.id}
                    notice={{
                      id: n.id,
                      title: n.title,
                      body: n.body,
                      from: n.fromName,
                      date: n.dateLabel,
                      priority: n.priority,
                      unread: n.unread,
                    }}
                    onRead={() => markRead.mutate(n.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* ── My Broadcasts Tab ────────────────────────────────────── */}
          {tab === "My Broadcasts" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">
                    Your Broadcasts
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    Notices you've sent to your sheep
                  </p>
                </div>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                             text-white text-[12px] font-semibold rounded-xl transition-colors"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">New Broadcast</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>

              {loadingBroadcasts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={20} className="text-slate-300 animate-spin" />
                </div>
              ) : myBroadcasts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                  <Megaphone
                    size={28}
                    className="text-slate-200 mx-auto mb-3"
                  />
                  <p className="text-[14px] text-slate-400 font-light">
                    No broadcasts yet
                  </p>
                  <p className="text-[12px] text-slate-400 mt-1">
                    Send your first announcement to your sheep
                  </p>
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#E6F1FB] text-[#185FA5]
                               text-[12px] font-semibold rounded-xl hover:bg-[#d0e5f7] transition-colors"
                  >
                    <Plus size={14} /> Create broadcast
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBroadcasts.map((n) => (
                    <div
                      key={n.id}
                      className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              n.priority === "urgent"
                                ? "bg-red-50 text-red-500"
                                : "bg-[#E6F1FB] text-[#185FA5]"
                            }`}
                          >
                            <Megaphone size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-[14px] font-semibold text-slate-900">
                                {n.title}
                              </h4>
                              {n.priority === "urgent" && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {n.body}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-2">
                              {n.dateLabel}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteNotice.mutate(n.id)}
                          disabled={deleteNotice.isPending}
                          className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50
                                     transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === "schedule" && (
          <MyScheduleModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "sheep" && (
          <MySheepModal
            onClose={() => setActiveModal(null)}
            onViewAll={() => navigate("/dashboard/shepherd/sheep")}
          />
        )}
        {activeModal === "contact" && (
          <ContactAdminModal
            onClose={() => setActiveModal(null)}
            shepherdName={shepherdName}
          />
        )}
        {createOpen && (
          <CreateNoticeModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onSubmit={handleCreateNotice}
            loading={createNotice.isPending}
            shepherdName={shepherdName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShepherdCommunityHub;
