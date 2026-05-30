import { fadeUp } from "@/components/shared/animation";
import { motion } from "framer-motion";

const TimeLineStrip = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-10 py-24 md:py-32">
      <motion.div
        variants={fadeUp(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-12"
      >
        <div className="h-[1.5px] w-8 bg-[#185FA5]" />
        <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
          Milestones
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
        {[
          {
            year: "1828",
            label: "Founded",
            note: "Established as the voice of Presbyterian students in Ghana.",
          },
          {
            year: "16",
            label: "Regions",
            note: "A chapter presence spanning every region across the country.",
          },
          {
            year: "98+",
            label: "Campuses",
            note: "Active chapters in universities, colleges, and training schools.",
          },
        ].map(({ year, label, note }, i) => (
          <motion.div
            key={label}
            variants={fadeUp(i * 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#fafaf9] hover:bg-white transition-colors duration-300 px-8 py-10 group"
          >
            <p className="font-serif text-[clamp(36px,4vw,52px)] font-light text-[#0c0d0e] leading-none tracking-tight mb-2">
              {year}
            </p>
            <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-[#185FA5] mb-4">
              {label}
            </p>
            <p className="text-[13px] font-light leading-[1.75] text-slate-500">
              {note}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TimeLineStrip;
