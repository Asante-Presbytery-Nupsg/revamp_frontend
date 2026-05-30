import { motion, type Variants, type Transition } from "framer-motion";
import { ClipboardCheck, Link2, BellRing } from "lucide-react";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      delay,
    } as Transition,
  },
});

const slideIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      delay,
    } as Transition,
  },
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "The Registry",
    desc: "Provide your basic details and institution through our secure portal. Takes less than two minutes.",
    icon: ClipboardCheck,
    accent: "Fill the form",
  },
  {
    number: "02",
    title: "The Connection",
    desc: "We link your data immediately with your specific campus chapter leads who will reach out to you.",
    icon: Link2,
    accent: "Meet your chapter",
  },
  {
    number: "03",
    title: "The Arrival",
    desc: "Receive orientation updates and event notices before you even set foot on campus.",
    icon: BellRing,
    accent: "You're in",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const HowItWorksSection = () => {
  return (
    <section className="w-full bg-[#fafaf9] pb-32 pt-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* ── Header — compact on mobile, two-col on desktop ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[1.5px] w-8 bg-[#185FA5]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
                The Process
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-serif text-[clamp(42px,5vw,64px)] font-light leading-[0.95] tracking-tight text-[#0c0d0e]"
            >
              Simple. <em className="italic text-[#185FA5]">Swift.</em>{" "}
              <br className="hidden sm:block" />
              Secure.
            </motion.h2>
          </div>

          <motion.div
            variants={fadeUp(0.14)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:text-right"
          >
            <p className="text-[15px] font-light leading-[1.8] text-slate-500 max-w-sm lg:max-w-72.5">
              A three-step journey designed to prepare you for campus life
              before it begins.
            </p>
          </motion.div>
        </div>

        {/* ── Steps ── */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={slideIn(idx * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.01)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
                  {/* Step number — large, decorative */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2 shrink-0">
                    <span className="font-serif italic text-[42px] sm:text-[52px] font-light text-slate-100 leading-none select-none group-hover:text-blue-100 transition-colors duration-300">
                      {step.number}
                    </span>
                    <div className="w-px h-6 bg-slate-100 hidden sm:block" />
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#185FA5]/10 transition-colors duration-300">
                      <Icon size={18} className="text-[#185FA5]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-serif text-[clamp(20px,2.5vw,28px)] font-light text-[#0c0d0e] tracking-tight">
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-slate-300 group-hover:text-[#185FA5] transition-colors duration-300 whitespace-nowrap mt-1 hidden sm:block">
                        {step.accent}
                      </span>
                    </div>
                    <p className="text-[15px] font-light leading-[1.8] text-slate-500">
                      {step.desc}
                    </p>
                    {/* Mobile accent label */}
                    <span className="sm:hidden mt-3 inline-block text-[10px] font-medium tracking-[0.18em] uppercase text-slate-300">
                      {step.accent}
                    </span>
                    {/* Animated rule */}
                    <div className="mt-5 h-px w-0 bg-[#185FA5]/25 transition-all duration-500 group-hover:w-full rounded-full" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
