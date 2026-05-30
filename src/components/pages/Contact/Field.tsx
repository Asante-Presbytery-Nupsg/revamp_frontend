import { motion } from "framer-motion";
import { fadeUp } from "../../shared/animation";

const Field: React.FC<{
  label: string;
  delay?: number;
  children: React.ReactNode;
}> = ({ label, delay = 0, children }) => (
  <motion.div
    variants={fadeUp(delay)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="space-y-2"
  >
    <label className="text-[10px] font-medium tracking-[0.3em] uppercase text-slate-400 block">
      {label}
    </label>
    {children}
  </motion.div>
);

export default Field;
