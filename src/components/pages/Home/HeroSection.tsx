import React from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import papa from "@/assets/papa.webp";
import guy from "@/assets/guy1.webp";
import lady from "@/assets/lady.webp";

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const lineVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as Transition,
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      delay,
    } as Transition,
  }),
};

// imgDrop is a factory that returns a Variants object.
// Typed as `: Variants` on the return so framer-motion's `variants` prop
// accepts it without complaint.
const imgDrop = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      delay,
    } as Transition,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-fit lg:h-[92vh]  bg-[#fafaf9] text-[#0c0d0e] overflow-hidden flex items-center">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <motion.span
          animate={{ x: ["-20px", "20px"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="text-[25vw] font-black uppercase text-[#0c0d0e] opacity-[0.025] whitespace-nowrap font-sans"
        >
          NUPS-G
        </motion.span>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 max-w-300 mx-auto w-full px-6 lg:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen">
        {/* ── LEFT: Content ── */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="flex items-center gap-2 mb-7"
          >
            <Sparkles size={16} className="text-[#185FA5]" />
            <span className="text-[11px] font-medium tracking-[0.28em] uppercase text-[#185FA5]">
              Est. 1828 · Tertiary Ministry
            </span>
          </motion.div>

          {/* Headline — each line clips and slides up */}
          <h1 className="font-serif text-[clamp(50px,6vw,78px)] font-light leading-[0.95] tracking-tight mb-7">
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineVariants} className="block">
                A Home
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={lineVariants} className="block">
                <em className="italic text-[#185FA5] font-light">Away</em> From
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={lineVariants} className="block">
                <span
                  style={
                    {
                      WebkitTextStroke: "1.5px #0c0d0e",
                      color: "transparent",
                    } as React.CSSProperties
                  }
                >
                  Home.
                </span>
              </motion.span>
            </span>
          </h1>

          {/* Body */}
          <motion.p
            variants={fadeUp}
            custom={0.55}
            className="text-[17px] font-light leading-[1.8] text-slate-500 max-w-100 mb-10"
          >
            The Presbyterian student experience is about more than books. It's
            about community, spirit, and growth that lasts a lifetime.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={0.7}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            <Link to="/register">
              <button className="group relative inline-flex items-center gap-2.5 bg-[#0c0d0e] text-white px-7 py-3.5 rounded-full text-[13px] font-medium overflow-hidden transition-colors hover:bg-[#185FA5]">
                <span className="relative z-10">Start Registration</span>
                <ArrowRight
                  size={15}
                  className="relative z-10 transition-transform group-hover:translate-x-1"
                />
              </button>
            </Link>

            <button className="inline-flex items-center border border-slate-200 text-[#0c0d0e] px-7 py-3.5 rounded-full text-[13px] font-medium transition-colors hover:border-[#185FA5] hover:text-[#185FA5]">
              Our Programs
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            custom={0.9}
            className="flex gap-8 mt-12 pt-10 border-t border-slate-200 w-full justify-center lg:justify-start"
          >
            {(
              [
                { n: "98+", l: "Campuses" },
                { n: "16", l: "Regions" },
                { n: "1828", l: "Founded" },
              ] as const
            ).map(({ n, l }) => (
              <div key={l}>
                <p className="font-serif text-[34px] font-normal leading-none tracking-tight text-[#0c0d0e]">
                  {n}
                </p>
                <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-slate-400 mt-1">
                  {l}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Image Collage ── */}
        <div className="relative h-85 md:h-145 w-full">
          {/* Floating "Registrations Open" badge */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 left-0 z-10 flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-medium text-[#0c0d0e] whitespace-nowrap">
              Registrations Open
            </span>
          </motion.div>

          {/* Main large image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imgDrop(0.35)}
            className="absolute top-0 right-0 w-[64%] h-[75%] md:h-105 rounded-[18px] overflow-hidden z-1 shadow-2xl"
          >
            <img
              src={papa}
              alt="Main"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Secondary left image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imgDrop(0.55)}
            className="absolute top-[12%] left-0 w-[47%] h-[52%] md:h-70 rounded-[18px] overflow-hidden z-2 border-[5px] border-[#fafaf9] shadow-xl"
          >
            <img
              src={lady}
              alt="Lady"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0c0d0e] text-white text-[10px] font-medium tracking-[0.2em] uppercase px-4 py-2 rounded-full whitespace-nowrap z-10">
              Community
            </div>
          </motion.div>

          {/* Small bottom-right image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imgDrop(0.72)}
            className="absolute bottom-2 right-[12%] w-[32%] h-[35%] md:h-48.75 rounded-[18px] overflow-hidden z-3 border-[5px] border-[#fafaf9] shadow-lg"
          >
            <img
              src={guy}
              alt="Guy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Glow orb */}
          <motion.div
            animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.15, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-4 w-28 h-28 rounded-full bg-blue-200 blur-[50px] pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
