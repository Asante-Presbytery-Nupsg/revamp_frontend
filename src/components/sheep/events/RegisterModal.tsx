import { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import type { NupsgEvent } from "@/api/events.api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ── Component ─────────────────────────────────────────────────────────────────

interface RegisterModalProps {
  event: NupsgEvent;
  isAuthenticated: boolean; // true = sheep user logged in, false = guest
  onClose: () => void;
  onConfirm: (guestData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) => void;
  loading: boolean;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  event,
  isAuthenticated,
  onClose,
  onConfirm,
  loading,
}) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const guestValid =
    form.firstName.trim() && form.lastName.trim() && form.email.trim();

  const handleSubmit = () => {
    if (isAuthenticated) {
      onConfirm();
    } else {
      if (!guestValid) return;
      onConfirm({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-light text-[20px] text-slate-800 leading-snug">
              {isAuthenticated ? "Confirm Registration" : "Register for Event"}
            </h3>
            <p className="text-[12px] text-slate-400 font-light mt-0.5">
              {isAuthenticated
                ? "You're about to register for this event"
                : "Fill in your details to register"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Event summary */}
        <div className="px-5 py-4 bg-slate-50/60 border-b border-slate-100">
          <p className="text-[14px] font-semibold text-slate-900 mb-2">
            {event.title}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <Calendar size={12} className="text-[#185FA5] shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <Clock size={12} className="text-[#185FA5] shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <MapPin size={12} className="text-[#185FA5] shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Guest form */}
        {!isAuthenticated && (
          <div className="px-5 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Ama"
                  className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                             transition-colors placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Owusu"
                  className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                             transition-colors placeholder:text-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="ama@example.com"
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                           transition-colors placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Phone{" "}
                <span className="text-slate-300 font-normal normal-case">
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+233 24 000 0000"
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                           transition-colors placeholder:text-slate-300"
              />
            </div>
          </div>
        )}

        {/* Spots remaining */}
        {event.attendanceCap > 0 && (
          <div
            className={`mx-5 ${isAuthenticated ? "mt-4" : "mt-0"} mb-1 px-3 py-2 rounded-xl bg-[#E6F1FB] text-[12px] text-[#185FA5] font-medium`}
          >
            {Math.max(0, event.attendanceCap - event.registered)} spots
            remaining
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 px-5 py-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!isAuthenticated && !guestValid)}
            className="flex-1 py-2.5 rounded-xl bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
