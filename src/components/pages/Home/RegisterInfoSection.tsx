import { motion, type Variants, type Transition } from "framer-motion";
import { ArrowRight } from "lucide-react";
import img1 from "../../../assets/guy1.webp";

// ─── Shared animation variants (same easing as HeroSection) ──────────────────

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 28 },
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

const imgReveal = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay } as Transition,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

const RegisterInfoSection = () => {
  const institutions = [
    "KNUST",
    "Legon",
    "UCC",
    "UDS",
    "UEW",
    "UENR",
    "Tech Unis",
  ];

  return (
    <section className="w-full bg-[#fafaf9] pt-12 pb-24 md:pt-32 md:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* ── BLOCK 1: Vision — Images + Quote ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 md:mb-28">
          {/* Single image + floating overlays */}
          <div className="relative w-full order-2 lg:order-1 px-6 md:px-0">
            {/* Main image — full width tall portrait */}
            <motion.div
              variants={imgReveal(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full aspect-4/5 rounded-[20px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.09)]"
            >
              <img
                src={img1}
                alt="NUPS-G student"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1400 ease-out"
              />
            </motion.div>

            {/* Floating quote card — bottom-left, slightly outside the image */}
            <motion.div
              variants={fadeUp(0.38)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute bottom-8 -left-1 md:-left-8 z-10 bg-white border border-slate-100 rounded-2xl px-5 py-4 max-w-55 shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
            >
              <p className="font-serif italic text-[14px] font-light text-[#0c0d0e] leading-snug mb-3">
                "Faith, fellowship, and purpose — all in one place."
              </p>
              <div className="flex items-center gap-2">
                <div className="h-px w-5 bg-[#185FA5]" />
                <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#185FA5]">
                  NUPS-G Vision
                </span>
              </div>
            </motion.div>

            {/* Floating stat badge — top-right, bobs gently */}
            <motion.div
              variants={fadeUp(0.52)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-8 -right-1 md:-right-7 z-10 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-md"
            >
              <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-slate-400">
                Members Nationwide
              </p>
              <p className="font-serif text-[26px] font-light text-[#0C447C] leading-none mt-1">
                10,000+
              </p>
            </motion.div>

            {/* Glow orb */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-4 w-24 h-24 rounded-full bg-blue-200 blur-[45px] pointer-events-none"
            />
          </div>

          {/* Editorial quote */}
          <div className="order-1 lg:order-2">
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4 md:mb-8"
            >
              <div className="h-[1.5px] w-8 bg-[#185FA5]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
                Our Vision
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-serif text-[clamp(32px,4vw,52px)] font-light leading-[1.15] tracking-tight text-[#0c0d0e] mb-8"
            >
              A bridge to a growing family of believers passionate about{" "}
              <em className="italic text-[#185FA5]">spiritual growth</em> and
              leadership.
            </motion.h2>

            <motion.div
              variants={fadeUp(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="h-px w-16 bg-slate-200 mb-8"
            />

            <motion.p
              variants={fadeUp(0.28)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[16px] font-light leading-[1.8] text-slate-500 max-w-105"
            >
              Since 1828, NUPS-G has walked alongside Presbyterian students
              through every chapter of their academic journey — from orientation
              to graduation.
            </motion.p>
          </div>
        </div>

        {/* ── BLOCK 2: Eligibility ─────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#0C447C] rounded-3xl md:rounded-4xl px-8 md:px-14 py-12 md:py-16 relative overflow-hidden"
        >
          {/* Watermark — blue-tinted, not black */}
          <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-8 md:pr-14">
            <span
              className="font-sans font-black uppercase text-white opacity-[0.05] leading-none"
              style={{ fontSize: "clamp(72px, 15vw, 160px)" }}
            >
              NUPS-G
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: headline */}
            <motion.div
              variants={fadeUp(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1.5px] w-8 bg-[#85B7EB]" />
                <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB]">
                  Eligibility
                </span>
              </div>
              <h2 className="font-serif text-[clamp(36px,5vw,60px)] font-light leading-[1.05] tracking-tight text-white">
                Who belongs <br />
                <em className="italic text-[#85B7EB]">here?</em>
              </h2>
            </motion.div>

            {/* Right: body + pills + CTA */}
            <motion.div
              variants={fadeUp(0.16)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[16px] font-light leading-[1.85] text-white/60 mb-7">
                All freshers entering tertiary institutions in Ghana —
                Universities, Colleges of Education, Nursing Training, and
                Technical Institutions.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {institutions.map((uni, i) => (
                  <motion.span
                    key={uni}
                    variants={fadeUp(0.22 + i * 0.04)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="px-3.5 py-1.5 bg-white/6 border border-white/10 rounded-full text-[10px] font-medium tracking-[0.12em] uppercase text-white/50 hover:border-white/20 hover:text-white/80 transition-all duration-200 cursor-default"
                  >
                    {uni}
                  </motion.span>
                ))}
              </div>

              <a
                href="/about"
                className="group inline-flex items-center gap-2 text-[12px] font-medium text-white/60 hover:text-white transition-colors duration-200"
              >
                Learn about our chapters
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterInfoSection;
