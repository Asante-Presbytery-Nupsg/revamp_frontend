"use no memo";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  MapPin as MapPinIcon,
  Mail,
  User,
  Loader2,
} from "lucide-react";
import { EventCard } from "@/components/sheep/events/EventCard";
import { NoticeCard } from "@/components/sheep/events/NoticeCard";
import { RegisterModal } from "@/components/sheep/events/RegisterModal";
import {
  useEvents,
  useRegisterForEvent,
  useUnregisterFromEvent,
} from "@/hooks/queries/useEvents";
import {
  useNotices,
  useMarkNoticeRead,
  useMarkAllNoticesRead,
} from "@/hooks/queries/useNotices";
import { useAuthStore } from "@/store/useAuthStore";
import type { NupsgEvent } from "@/api/events.api";
import MyScheduleModal from "@/components/sheep/events/ScheduleModal";
import PrayerChainModal from "@/components/sheep/events/PrayerChain";
import ContactAdminModal from "@/components/sheep/events/ContactAdminModal";
import MyShepherdModal from "@/components/sheep/events/ShepherdModal";

// ─── Types ────────────────────────────────────────────────────────────────────

const TABS = ["Events", "Notices"] as const;
type Tab = (typeof TABS)[number];
type QuickLinkModal = "schedule" | "prayer" | "contact" | "shepherd" | null;

// ─── Page ─────────────────────────────────────────────────────────────────────

const SheepEvents: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Events");
  const [registerTarget, setRegisterTarget] = useState<NupsgEvent | null>(null);
  const [activeModal, setActiveModal] = useState<QuickLinkModal>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const memberName = user ? `${user.firstName} ${user.lastName}` : "Member";

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
      label: "Prayer Chain",
      sub: "Submit a request",
      action: () => setActiveModal("prayer"),
    },
    {
      icon: Mail,
      label: "Contact Admin",
      sub: "Send a message",
      action: () => setActiveModal("contact"),
    },
    {
      icon: User,
      label: "My Shepherd",
      sub: "View profile",
      action: () => setActiveModal("shepherd"),
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
    else setRegisterTarget(event);
  };

  const handleConfirmRegister = (guestData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) => {
    if (!registerTarget) return;
    registerMutation.mutate(
      { eventId: registerTarget.id, guest: guestData },
      { onSuccess: () => setRegisterTarget(null) },
    );
  };

  // ── Notices ───────────────────────────────────────────────────────────────

  const { data: noticesPage, isLoading: loadingNotices } = useNotices({
    limit: 50,
  });
  const notices = noticesPage?.data ?? [];
  const unreadCount = noticesPage?.unreadCount ?? 0;
  const markRead = useMarkNoticeRead();
  const markAllRead = useMarkAllNoticesRead();

  return (
    <div className="max-w-5xl mx-auto px-2 space-y-8 sm:space-y-10">
      {/* Header */}
      <header className="flex flex-col gap-1.5">
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight leading-tight">
          Community Hub
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Events · Announcements · Updates
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
            className={`relative px-6 sm:px-8 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
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
          {tab === "Events" ? (
            <div className="space-y-10 sm:space-y-12">
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
                  <div className="flex items-center justify-center py-16">
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
                        onToggleRegister={handleToggle}
                        loading={loadingId === e.id}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : (
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
        </motion.div>
      </AnimatePresence>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === "schedule" && (
          <MyScheduleModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "prayer" && (
          <PrayerChainModal
            onClose={() => setActiveModal(null)}
            memberName={memberName}
          />
        )}
        {activeModal === "contact" && (
          <ContactAdminModal
            onClose={() => setActiveModal(null)}
            memberName={memberName}
          />
        )}
        {activeModal === "shepherd" && (
          <MyShepherdModal onClose={() => setActiveModal(null)} />
        )}
        {registerTarget && (
          <RegisterModal
            event={registerTarget}
            isAuthenticated={isAuthenticated}
            onClose={() => setRegisterTarget(null)}
            onConfirm={handleConfirmRegister}
            loading={registerMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SheepEvents;
