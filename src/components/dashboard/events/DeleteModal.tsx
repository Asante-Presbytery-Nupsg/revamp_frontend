import type { NupsgEvent } from "@/types/event.types";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const DeleteModal: React.FC<{
  event: NupsgEvent;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ event, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0d0e]/40  backdrop-blur-md">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="bg-white rounded-2xl shadow-sm w-full max-w-sm p-6"
    >
      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
        <Trash2 size={20} className="text-red-500" />
      </div>
      <h3 className="font-semibold text-slate-900 text-[16px] mb-1">
        Delete event?
      </h3>
      <p className="text-[13px] text-slate-500 mb-6">
        "<span className="font-medium text-slate-700">{event.title}</span>" will
        be permanently deleted. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

export default DeleteModal;
