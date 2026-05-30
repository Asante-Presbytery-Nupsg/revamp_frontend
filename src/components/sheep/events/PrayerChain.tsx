import type { NoticePriority } from "@/api/notices.api";
import { useCreateNotice } from "@/hooks/queries/useNotices";
import { useState } from "react";
import ModalShell from "./ModalShell";
import { CheckCircle2, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const PrayerChainModal: React.FC<{
  onClose: () => void;
  memberName: string;
}> = ({ onClose, memberName }) => {
  const [request, setRequest] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [sent, setSent] = useState(false);
  const createNotice = useCreateNotice();

  const canSend = request.trim().length >= 10;

  const handleSend = () => {
    if (!canSend) return;
    createNotice.mutate(
      {
        title: "Prayer Request",
        body: request.trim(),
        priority: "normal" as NoticePriority,
        fromName: anonymous ? "Anonymous" : memberName,
        targetRole: "shepherd",
      },
      { onSuccess: () => setSent(true) },
    );
  };

  return (
    <ModalShell
      title="Prayer Chain"
      subtitle="Submit a prayer request to your shepherd"
      onClose={onClose}
      footer={
        sent ? undefined : (
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setAnonymous((p) => !p)}
                className={`w-8 h-5 rounded-full relative transition-colors duration-200 ${
                  anonymous ? "bg-[#0C447C]" : "bg-slate-200"
                }`}
              >
                <motion.div
                  animate={{ x: anonymous ? 14 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
              <span className="text-[11px] text-slate-500">Anonymous</span>
            </label>
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
                  <Heart size={14} /> Send Request
                </>
              )}
            </button>
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
            Request submitted
          </p>
          <p className="text-[13px] text-slate-400">
            Your shepherd will be praying for you.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-5 py-2.5 bg-[#E6F1FB] text-[#185FA5] text-[13px] font-semibold rounded-xl
                       hover:bg-[#d0e5f7] transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="px-5 py-5 space-y-4">
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Your shepherd will receive your request privately and hold you in
            prayer.
          </p>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Request
            </label>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Share what you'd like prayer for..."
              rows={5}
              className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-300 resize-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              {request.length > 0 && request.length < 10
                ? `${10 - request.length} more characters needed`
                : `${request.length} characters`}
            </p>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default PrayerChainModal;
