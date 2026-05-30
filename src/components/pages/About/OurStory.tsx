import { fadeUp, imgReveal } from "@/components/shared/animation";
import { motion } from "framer-motion";
import papa from "@/assets/papa.webp";

const OurStory = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-28 md:pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Image */}
        <div className="relative">
          <motion.div
            variants={imgReveal(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full aspect-4/5 rounded-[20px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.09)]"
          >
            <img
              src={papa}
              alt="NUPS-G history"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1400 ease-out"
            />
          </motion.div>

          {/* Floating stat */}
          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-8 -right-2 md:-right-7 z-10 bg-[#0C447C] text-white rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(12,68,124,0.35)]"
          >
            <p className="font-serif italic text-[36px] font-light leading-none text-white">
              98+
            </p>
            <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-white/50 mt-1.5">
              Active Chapters
            </p>
          </motion.div>

          {/* Glow orb */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.15, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-4 w-24 h-24 rounded-full bg-blue-200 blur-[45px] pointer-events-none"
          />
        </div>

        {/* Text */}
        <div>
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-[1.5px] w-8 bg-[#185FA5]" />
            <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
              Our Story
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-serif text-[clamp(30px,4vw,46px)] font-light leading-[1.1] tracking-tight text-[#0c0d0e] mb-8"
          >
            A Legacy of <br />
            <em className="italic text-[#185FA5]">Tertiary Ministry.</em>
          </motion.h2>

          <div className="space-y-5">
            {[
              "The National Union of Presbyterian Students-Ghana (NUPS-G) is the umbrella body for all Presbyterian students in tertiary institutions across the country.",
              "We are more than just a union — we are a movement dedicated to the holistic development of students, nurturing the mind through academic excellence and the soul through the Reformed faith.",
            ].map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp(0.14 + i * 0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-[16px] font-light leading-[1.85] text-slate-500"
              >
                {para}
              </motion.p>
            ))}

            <motion.p
              variants={fadeUp(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-serif italic text-[18px] text-[#0c0d0e] pt-2"
            >
              "For Christ, we live."
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
