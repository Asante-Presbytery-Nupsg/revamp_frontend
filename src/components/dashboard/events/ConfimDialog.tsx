import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
const ConfirmDialog: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.15 }}
    className="absolute inset-0 z-20 bg-white/96 backdrop-blur-sm rounded-xl
               flex flex-col items-center justify-center gap-4 px-6"
  >
    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
      <AlertTriangle size={18} className="text-amber-500" />
    </div>
    <p className="text-[13px] text-slate-600 text-center leading-relaxed font-medium">
      {message}
    </p>
    <div className="flex gap-2 w-full">
      <button
        onClick={onCancel}
        className="flex-1 h-9 rounded-xl border border-slate-200 text-[13px]
                   font-medium text-slate-500 hover:bg-slate-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600
                   text-white text-[13px] font-semibold transition-colors"
      >
        Confirm
      </button>
    </div>
  </motion.div>
);

export default ConfirmDialog;
