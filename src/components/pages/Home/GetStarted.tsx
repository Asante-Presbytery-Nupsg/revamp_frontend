import { motion, type Variants, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users2 } from "lucide-react";

// ─── Variants ─────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

const GetStarted = () => {
  return (
    <section className="relative w-full pt-12 md:pt-20 pb-36  bg-white overflow-hidden">
      {/* Watermark — matches hero */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <motion.span
          animate={{ x: ["-16px", "16px"] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="font-sans font-black uppercase text-[#0c0d0e] opacity-[0.025] whitespace-nowrap"
          style={{ fontSize: "clamp(80px, 20vw, 260px)" }}
        >
          NUPS-G
        </motion.span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col items-center text-center">
          {/* Social proof badge */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 mb-10"
          >
            <Users2 size={14} className="text-[#185FA5]" />
            <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-[#185FA5]">
              Join 5,000+ Students across Ghana
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUp(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-serif text-[clamp(42px,7vw,80px)] font-light leading-none tracking-tight text-[#0c0d0e] mb-8"
          >
            Begin your <br />
            <em className="italic text-[#185FA5]">Journey</em> with us.
          </motion.h2>

          {/* Body */}
          <motion.p
            variants={fadeUp(0.16)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[17px] font-light leading-[1.8] text-slate-500 max-w-115 mb-12"
          >
            Registration for the 2026 academic year is now open. Find your
            campus family and stay rooted in faith.
          </motion.p>

          {/* CTA group */}
          <motion.div
            variants={fadeUp(0.24)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-5"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-4 bg-[#0c0d0e] hover:bg-[#185FA5] text-white pl-8 pr-5 py-4 rounded-2xl transition-colors duration-300"
              >
                <span className="text-[13px] font-medium tracking-[0.12em] uppercase">
                  Register Now
                </span>
                {/* Arrow pill */}
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight size={16} />
                </div>
              </motion.button>
            </Link>

            {/* Sub-label */}
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-slate-300">
              Admission Year 2026 / 2027
            </span>
          </motion.div>

          {/* Divider + stats row */}
          <motion.div
            variants={fadeUp(0.34)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-4 sm:gap-10 mt-16 pt-10 border-t border-slate-200 w-full justify-center"
          >
            {[
              { n: "98+", l: "Campuses" },
              { n: "16", l: "Regions" },
              { n: "1828", l: "Est." },
            ].map(({ n, l }, i) => (
              <div
                key={l}
                className={`flex flex-col items-center ${i !== 2 ? "border-r border-slate-200 pr-10" : ""}`}
              >
                <span className="font-serif text-[32px] font-light text-[#0c0d0e] leading-none tracking-tight">
                  {n}
                </span>
                <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-slate-400 mt-1.5">
                  {l}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
