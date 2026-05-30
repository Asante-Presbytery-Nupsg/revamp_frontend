import { motion } from "framer-motion";
import { fadeUp, lineReveal } from "../../shared/animation";

const HeroContact = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* Drifting watermark */}
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
          style={{ fontSize: "clamp(80px, 22vw, 280px)" }}
        >
          NUPS-G
        </motion.span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-[1.5px] w-8 bg-[#185FA5]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
                Reach Out
              </span>
            </motion.div>

            <h1
              className="font-serif font-light text-[#0c0d0e] leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(52px, 9vw, 108px)" }}
            >
              <span className="block overflow-hidden pb-2">
                <motion.span
                  variants={lineReveal(0.1)}
                  initial="hidden"
                  animate="visible"
                  className="block"
                >
                  Let's start a
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-3">
                <motion.span
                  variants={lineReveal(0.22)}
                  initial="hidden"
                  animate="visible"
                  className="block"
                >
                  <em className="italic text-[#185FA5]">Conversation.</em>
                </motion.span>
              </span>
            </h1>
          </div>

          <motion.div
            variants={fadeUp(0.4)}
            initial="hidden"
            animate="visible"
            className="lg:col-span-4 pb-2"
          >
            <div className="border-l-[1.5px] border-slate-200 pl-7">
              <p className="text-[16px] font-light leading-[1.8] text-slate-500">
                Whether it's a question, a chapter request, or just saying hello
                — we'd love to hear from you.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroContact;
