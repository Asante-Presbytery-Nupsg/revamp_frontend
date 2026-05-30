import React from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay,
    } as Transition,
  },
});

// ─── NotFound ─────────────────────────────────────────────────────────────────

export const NotFound: React.FC = () => {
  return (
    <div className="bg-[#fafaf9] min-h-screen flex items-center justify-center overflow-hidden relative px-6">
      {/* Drifting watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          animate={{ x: ["-16px", "16px"] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="font-sans font-black uppercase text-[#0c0d0e] opacity-[0.025] whitespace-nowrap"
          style={{ fontSize: "clamp(100px, 28vw, 360px)" }}
        >
          404
        </motion.span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-[1.5px] w-8 bg-[#185FA5]" />
          <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
            Error 404
          </span>
          <div className="h-[1.5px] w-8 bg-[#185FA5]" />
        </motion.div>

        <motion.h1
          variants={fadeUp(0.08)}
          initial="hidden"
          animate="visible"
          className="font-serif font-light text-[#0c0d0e] leading-[0.95] tracking-tight mb-6"
          style={{ fontSize: "clamp(52px, 8vw, 88px)" }}
        >
          Page not <br />
          <em className="italic text-[#185FA5]">found.</em>
        </motion.h1>

        <motion.p
          variants={fadeUp(0.16)}
          initial="hidden"
          animate="visible"
          className="text-[16px] font-light leading-[1.8] text-slate-500 mb-10 max-w-sm"
        >
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </motion.p>

        <motion.div
          variants={fadeUp(0.24)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-4 bg-[#0c0d0e] hover:bg-[#185FA5] text-white pl-7 pr-5 py-4 rounded-2xl transition-colors duration-200"
            >
              <span className="text-[12px] font-medium tracking-widest uppercase">
                Back to Home
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                <ArrowRight size={14} />
              </div>
            </motion.button>
          </Link>

          <Link
            to="/contact"
            className="text-[12px] font-medium text-slate-400 hover:text-[#185FA5] transition-colors duration-200 tracking-wide"
          >
            Contact support
          </Link>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate="visible"
          className="mt-16 border-t border-slate-200 pt-8"
        >
          <p className="font-serif italic text-[15px] font-light text-slate-400">
            "Every path leads somewhere — let's find yours."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Unauthorized ─────────────────────────────────────────────────────────────

export const Unauthorized: React.FC = () => {
  return (
    <div className="bg-[#fafaf9] min-h-screen flex items-center justify-center overflow-hidden relative px-6">
      {/* Drifting watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          animate={{ x: ["-16px", "16px"] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="font-sans font-black uppercase text-[#0c0d0e] opacity-[0.025] whitespace-nowrap"
          style={{ fontSize: "clamp(100px, 28vw, 360px)" }}
        >
          401
        </motion.span>
      </div>

      {/* Thin top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0C447C]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="w-14 h-14 rounded-2xl bg-[#0C447C] flex items-center justify-center mb-8"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </motion.div>

        <motion.div
          variants={fadeUp(0.06)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-[1.5px] w-8 bg-[#185FA5]" />
          <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
            Error 401
          </span>
          <div className="h-[1.5px] w-8 bg-[#185FA5]" />
        </motion.div>

        <motion.h1
          variants={fadeUp(0.12)}
          initial="hidden"
          animate="visible"
          className="font-serif font-light text-[#0c0d0e] leading-[0.95] tracking-tight mb-6"
          style={{ fontSize: "clamp(48px, 8vw, 84px)" }}
        >
          Access <br />
          <em className="italic text-[#185FA5]">restricted.</em>
        </motion.h1>

        <motion.p
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
          className="text-[16px] font-light leading-[1.8] text-slate-500 mb-10 max-w-sm"
        >
          You don't have permission to view this page. Please sign in or contact
          the NUPS-G team if you believe this is a mistake.
        </motion.p>

        <motion.div
          variants={fadeUp(0.28)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-4 bg-[#0C447C] hover:bg-[#185FA5] text-white pl-7 pr-5 py-4 rounded-2xl transition-colors duration-200"
            >
              <span className="text-[12px] font-medium tracking-widest uppercase">
                Sign In
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                <ArrowRight size={14} />
              </div>
            </motion.button>
          </Link>

          <Link to="/">
            <button className="text-[12px] font-medium text-slate-400 hover:text-[#185FA5] transition-colors duration-200 tracking-wide">
              Back to Home
            </button>
          </Link>
        </motion.div>

        {/* Stats strip — reinforces trust */}
        <motion.div
          variants={fadeUp(0.36)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-8 mt-16 pt-8 border-t border-slate-200"
        >
          {[
            { n: "98+", l: "Campuses" },
            { n: "16", l: "Regions" },
            { n: "1828", l: "Founded" },
          ].map(({ n, l }, i) => (
            <div
              key={l}
              className={`flex flex-col items-center ${i !== 2 ? "border-r border-slate-200 pr-8" : ""}`}
            >
              <span className="font-serif text-[26px] font-light text-[#0c0d0e] leading-none tracking-tight">
                {n}
              </span>
              <span className="text-[9px] font-medium tracking-[0.22em] uppercase text-slate-400 mt-1">
                {l}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default { NotFound, Unauthorized };
