"use no memo";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Loader2 } from "lucide-react";
import EventCard from "@/components/dashboard/events/EventCard";
import {
  createEventWithImage,
  updateEventWithImage,
  type CreateEventInput,
  type NupsgEvent,
} from "@/api/events.api";
import EventModal from "@/components/dashboard/events/EventModal";
import DeleteModal from "@/components/dashboard/events/DeleteModal";
import {
  useEvents,
  useDeleteEvent,
  useMarkEventCompleted,
} from "@/hooks/queries/useEvents";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// ─── Page ─────────────────────────────────────────────────────────────────────

type Modal =
  | { type: "create" }
  | { type: "edit"; event: NupsgEvent }
  | { type: "delete"; event: NupsgEvent }
  | null;

const STATUS_TABS = ["All", "upcoming", "completed"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const AdminEvents: React.FC = () => {
  const [modal, setModal] = useState<Modal>(null);
  const [statusTab, setStatusTab] = useState<StatusTab>("All");
  const qc = useQueryClient();

  const { data, isLoading } = useEvents({
    status: statusTab === "All" ? undefined : statusTab,
    limit: 50,
  });

  const events = data?.data ?? [];

  const deleteEvent = useDeleteEvent();
  const markCompleted = useMarkEventCompleted();

  const handleSave = (formData: CreateEventInput, imageFile?: File) => {
    if (modal?.type === "edit") {
      updateEventWithImage(modal.event.id, formData, imageFile)
        .then((updated) => {
          qc.invalidateQueries({ queryKey: queryKeys.events.all() });
          qc.invalidateQueries({
            queryKey: queryKeys.events.detail(updated.id),
          });
          toast.success("Event updated");
          setModal(null);
        })
        .catch(() => toast.error("Failed to update event"));
    } else {
      createEventWithImage(formData, imageFile)
        .then(() => {
          qc.invalidateQueries({ queryKey: queryKeys.events.all() });
          toast.success("Event created");
          setModal(null);
        })
        .catch(() => toast.error("Failed to create event"));
    }
  };
  const handleDelete = (id: string) => {
    deleteEvent.mutate(id, { onSuccess: () => setModal(null) });
  };

  const handleComplete = (id: string) => {
    markCompleted.mutate(id);
  };

  return (
    <>
      <AnimatePresence>
        {(modal?.type === "create" || modal?.type === "edit") && (
          <EventModal
            event={modal.type === "edit" ? modal.event : null}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
        {modal?.type === "delete" && (
          <DeleteModal
            event={modal.event}
            onClose={() => setModal(null)}
            onConfirm={() => handleDelete(modal.event.id)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight leading-tight">
              Events
            </h1>
            <p className="text-[13px] font-light text-slate-400 mt-0.5">
              {data?.pagination.total ?? 0} total events
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors shrink-0"
          >
            <Plus size={15} />
            <span className="hidden sm:block">Create Event</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize ${
                statusTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: events.length, color: "text-[#0C447C]" },
            {
              label: "Upcoming",
              value: events.filter((e) => e.status === "upcoming").length,
              color: "text-[#185FA5]",
            },
            {
              label: "Completed",
              value: events.filter((e) => e.status === "completed").length,
              color: "text-green-600",
            },
            {
              label: "Total Registered",
              value: events.reduce((a, e) => a + e.registered, 0),
              color: "text-[#0C447C]",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <p
                className={`font-serif text-[30px] font-light leading-none tracking-tight ${color}`}
              >
                {value}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1.5">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={22} className="text-slate-300 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
              <Calendar size={22} className="text-slate-300" />
            </div>
            <p className="text-[14px] font-light text-slate-400">
              No {statusTab === "All" ? "" : statusTab} events yet.
            </p>
            <button
              onClick={() => setModal({ type: "create" })}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#0C447C] text-white text-[12px] font-medium rounded-xl hover:bg-[#185FA5] transition-colors"
            >
              <Plus size={13} /> Create one
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <EventCard
                  event={event}
                  onEdit={() => setModal({ type: "edit", event })}
                  onDelete={() => setModal({ type: "delete", event })}
                  onComplete={() => handleComplete(event.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminEvents;
