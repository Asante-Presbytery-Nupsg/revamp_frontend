import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "../../shared/animation";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-28">
      <motion.div
        variants={fadeUp(0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#0c0d0e] rounded-3xl md:rounded-4xl px-8 md:px-16 py-14 md:py-20 relative overflow-hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10"
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-8 md:pr-14">
          <span
            className="font-sans font-black uppercase text-white opacity-[0.04] leading-none"
            style={{ fontSize: "clamp(60px, 14vw, 160px)" }}
          >
            1828
          </span>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB] mb-4">
            Ready?
          </p>
          <h2 className="font-serif text-[clamp(28px,4vw,48px)] font-light leading-[1.1] tracking-tight text-white">
            Be part of the{" "}
            <em className="italic text-[#85B7EB]">next chapter.</em>
          </h2>
        </div>

        <div className="relative z-10 shrink-0">
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-4 bg-white hover:bg-[#E6F1FB] text-[#0C447C] pl-7 pr-5 py-4 rounded-2xl transition-colors duration-200 "
            >
              <span className="text-[13px] font-medium tracking-widest uppercase">
                Register for 2026
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#0C447C]/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight size={15} className="text-[#0C447C]" />
              </div>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
