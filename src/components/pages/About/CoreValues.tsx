import { fadeUp } from "@/components/shared/animation";
import { motion } from "framer-motion";

const CoreValues = () => {
  return (
    <section className="bg-[#0C447C] py-24 md:py-32 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-10 md:pr-20">
        <span
          className="font-sans font-black uppercase text-white opacity-[0.04] leading-none"
          style={{ fontSize: "clamp(80px, 18vw, 200px)" }}
        >
          DNA
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 pb-16 border-b border-white/8">
          <div>
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[1.5px] w-8 bg-[#85B7EB]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB]">
                Our DNA
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-serif text-[clamp(36px,5vw,58px)] font-light leading-none tracking-tight text-white"
            >
              The Pillars of <em className="italic text-[#85B7EB]">NUPS-G</em>
            </motion.h2>
          </div>
          <motion.p
            variants={fadeUp(0.14)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[15px] font-light leading-[1.8] text-white/50 max-w-70 lg:text-right"
          >
            Four commitments that have defined our union for nearly a century.
          </motion.p>
        </div>

        {/* Table rows */}
        <div>
          {[
            {
              title: "Spirituality",
              desc: "Deeply rooted in the Reformed Tradition and the Word of God.",
              tag: "Reformed Faith",
            },
            {
              title: "Excellence",
              desc: "Striving for the highest standards in academic and moral life.",
              tag: "Academic Life",
            },
            {
              title: "Fellowship",
              desc: "A home away from home for every Presbyterian student.",
              tag: "Campus Family",
            },
            {
              title: "Heritage",
              desc: "Carrying the torch of the NUPS-G legacy since 1828.",
              tag: "Since 1828",
            },
          ].map(({ title, desc, tag }, i) => (
            <motion.div
              key={title}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group grid grid-cols-[20px_1fr] md:grid-cols-[20px_1fr_1fr_auto] items-center gap-4 md:gap-6 py-6 md:py-7 border-b border-white/[0.07] last:border-0 cursor-default"
            >
              {/* Number */}
              <span className="font-serif italic text-[13px] font-light text-white/20 group-hover:text-[#85B7EB] transition-colors duration-300 leading-none">
                0{i + 1}
              </span>

              {/* Title */}
              <h3
                className="font-serif font-light text-white group-hover:text-[#85B7EB] transition-colors duration-300 leading-none tracking-tight"
                style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
              >
                {title}
              </h3>

              {/* Description — hidden on mobile */}
              <p className="hidden md:block text-[13px] font-light leading-[1.75] text-white/40 group-hover:text-white/65 transition-colors duration-300">
                {desc}
              </p>

              {/* Tag pill — hidden on mobile */}
              <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-medium tracking-[0.18em] uppercase text-white/25 group-hover:border-[#85B7EB]/40 group-hover:text-[#85B7EB] transition-all duration-300 whitespace-nowrap">
                {tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
