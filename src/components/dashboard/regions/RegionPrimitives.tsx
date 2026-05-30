import { motion } from "framer-motion";
import { Trash2, Check, X } from "lucide-react";
import { inputCls } from "./regionData";

// ─── ConfirmDelete modal ──────────────────────────────────────────────────────

export const ConfirmDelete: React.FC<{
  label: string;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ label, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
    >
      <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
        <Trash2 size={18} className="text-red-500" />
      </div>
      <p className="text-[15px] font-semibold text-slate-900 mb-1">
        Delete "{label}"?
      </p>
      <p className="text-[12px] text-slate-400 mb-5">This cannot be undone.</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── InlineForm ───────────────────────────────────────────────────────────────

export const InlineForm: React.FC<{
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  extra?: React.ReactNode;
}> = ({ placeholder, value, onChange, onSave, onCancel, extra }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="overflow-hidden"
  >
    <div className="flex gap-2 pt-2 pb-1 flex-wrap">
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancel();
        }}
        placeholder={placeholder}
        className={`${inputCls} flex-1 min-w-45`}
      />
      {extra}
      <button
        onClick={onSave}
        disabled={!value.trim()}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white
                   text-[12px] font-semibold rounded-lg transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        <Check size={13} /> Save
      </button>
      <button
        onClick={onCancel}
        className="p-2.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  </motion.div>
);
