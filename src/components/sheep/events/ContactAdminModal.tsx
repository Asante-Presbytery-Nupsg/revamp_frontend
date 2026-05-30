import type { NoticePriority } from "@/api/notices.api";
import { useCreateNotice } from "@/hooks/queries/useNotices";
import { useState } from "react";
import ModalShell from "./ModalShell";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const ContactAdminModal: React.FC<{
  onClose: () => void;
  memberName: string;
}> = ({ onClose, memberName }) => {
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
        priority: "normal" as NoticePriority,
        fromName: memberName,
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
            <p className="text-[11px] text-slate-400 truncate">
              From: {memberName}
            </p>
            <div className="flex gap-2 shrink-0">
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
            className="mt-6 px-5 py-2.5 bg-[#E6F1FB] text-[#185FA5] text-[13px] font-semibold rounded-xl
                       hover:bg-[#d0e5f7] transition-colors"
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
              placeholder="e.g. Query about my membership"
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

export default ContactAdminModal;
