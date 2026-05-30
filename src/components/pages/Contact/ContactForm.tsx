import { useState } from "react";
import { fadeUp } from "../../shared/animation";
import { motion } from "framer-motion";
import Field from "./Field";
import { ArrowRight } from "lucide-react";

const subjects = [
  "General Inquiry",
  "Registration Support",
  "Alumni Relations",
  "Campus Chapter Request",
];

const ContactForm = () => {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="lg:col-span-7 lg:pr-8">
      {/* Subject pill selector */}
      <motion.div
        variants={fadeUp(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-slate-400 mb-4">
          What's this about?
        </p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(active === s ? null : s)}
              className={`
                      px-4 py-2 rounded-full text-[12px] font-medium border transition-all duration-200
                      ${
                        active === s
                          ? "bg-[#0c0d0e] text-white border-[#0c0d0e]"
                          : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-400 hover:text-[#0c0d0e]"
                      }
                    `}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      <form className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Field label="Full Name" delay={0.06}>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#185FA5] transition-colors bg-transparent font-serif text-base text-[#0c0d0e] placeholder:text-slate-300"
            />
          </Field>
          <Field label="Email Address" delay={0.1}>
            <input
              type="email"
              placeholder="john@university.edu"
              className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#185FA5] transition-colors bg-transparent font-serif text-base text-[#0c0d0e] placeholder:text-slate-300"
            />
          </Field>
        </div>

        <Field label="Institution" delay={0.14}>
          <input
            type="text"
            placeholder="e.g. KNUST, Legon, UCC..."
            className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#185FA5] transition-colors bg-transparent font-serif text-base text-[#0c0d0e] placeholder:text-slate-300"
          />
        </Field>

        <Field label="Your Message" delay={0.18}>
          <textarea
            rows={5}
            placeholder="How can the Union help you?"
            className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#185FA5] transition-colors bg-transparent font-serif text-base text-[#0c0d0e] placeholder:text-slate-300 resize-none"
          />
        </Field>

        <motion.div
          variants={fadeUp(0.22)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2"
        >
          <p className="text-[12px] font-light text-slate-400">
            We typically reply within 24–48 hours.
          </p>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-4 bg-[#0c0d0e] hover:bg-[#185FA5] text-white pl-6 pr-4 py-2 rounded-xl transition-colors duration-200 self-start sm:self-auto"
          >
            <span className="text-[12px] font-medium tracking-widest uppercase">
              Send Message
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight size={14} />
            </div>
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default ContactForm;
