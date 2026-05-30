import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";

export const FeedbackSuccess: React.FC<{
  anonymous: boolean;
  onReset: () => void;
}> = ({ anonymous, onReset }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border border-slate-200 flex flex-col items-center
                 text-center py-12 sm:py-16 px-6 sm:px-12 md:px-20 w-full max-w-sm sm:max-w-md"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
        className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5"
      >
        <CheckCircle2 size={32} className="text-green-500" />
      </motion.div>
      <h2 className="font-serif font-light text-[#0c0d0e] text-[24px] sm:text-[26px] tracking-tight mb-2">
        Feedback submitted
      </h2>
      <p className="text-[13px] font-light text-slate-400 max-w-xs mb-1">
        Thank you! Your feedback has been received and will be reviewed by the team.
      </p>
      {anonymous && (
        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
          <Lock size={11} /> Submitted anonymously
        </p>
      )}
      <button
        onClick={onReset}
        className="mt-8 px-6 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors"
      >
        Submit another
      </button>
    </motion.div>
  </div>
);

export default FeedbackSuccess;
