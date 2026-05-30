import React from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import papa from "@/assets/papa.webp";
import ndcImg from "@/assets/ndc.jpg";
import summitImg from "@/assets/summit.jpg";
import rallyImg from "@/assets/rally.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 32 },
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const pillars = [
  {
    number: "01",
    title: "Spiritual\nFormation",
    keyword: "Faith",
    desc: "Grounding members in the Reformed tradition through Bible studies, and Zonal Rallies.",
    bg: "#0C447C",
    accent: "#85B7EB",
  },
  {
    number: "02",
    title: "Academic\nSupport",
    keyword: "Excellence",
    desc: "Seminars focused on navigating tertiary education in Ghana with integrity and academic discipline.",
    bg: "#0c0d0e",
    accent: "#378ADD",
  },
  {
    number: "03",
    title: "Missions &\nService",
    keyword: "Service",
    desc: "Evangelism and community projects that fulfill our motto 'For Christ, we live' across Ghana.",
    bg: "#185FA5",
    accent: "#B5D4F4",
  },
];

const gatherings = [
  {
    name: "National Delegates Conference",
    date: "Aug 2026",
    loc: "KNUST, Kumasi",
    tag: "Annual",
    image: ndcImg,
  },
  {
    name: "National Prayer Summit",
    date: "Oct 2026",
    loc: "Legon, Accra",
    tag: "Spiritual",
    image: summitImg,
  },
  {
    name: "Zonal Leadership Rally",
    date: "Mar 2027",
    loc: "UCC, Cape Coast",
    tag: "Leadership",
    image: rallyImg,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ProgramsPage: React.FC = () => {
  return (
    <div className="bg-[#fafaf9] min-h-screen overflow-hidden">
      {/* ── 1. ASYMMETRIC HERO ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-0 md:min-h-[92vh] flex items-center relative overflow-hidden">
        {/* Full-bleed background image (right half only on desktop) */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="absolute right-0 top-0 bottom-0 w-[46%]">
            <img
              src={papa}
              alt="NUPS-G programs"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #fafaf9 0%, transparent 22%)",
              }}
            />
          </div>
        </div>

        {/* Constrained content — matches all other sections */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            {/* LEFT: text */}
            <div className="max-w-xl">
              {/* Watermark — scoped to text column */}
              <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none -z-10">
                <motion.span
                  animate={{ x: ["-12px", "12px"] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  className="font-sans font-black uppercase text-[#0c0d0e] opacity-[0.018] whitespace-nowrap"
                  style={{ fontSize: "clamp(80px, 18vw, 220px)" }}
                >
                  PROGRAMS
                </motion.span>
              </div>

              {/* Eyebrow */}
              <motion.div
                variants={fadeUp(0)}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 mb-8"
              >
                <div className="h-[1.5px] w-8 bg-[#185FA5]" />
                <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
                  The Experience
                </span>
              </motion.div>

              {/* Headline — stronger weight contrast */}
              <h1
                className="font-serif font-light text-[#0c0d0e] leading-[0.88] tracking-tight mb-8"
                style={{ fontSize: "clamp(56px, 7.5vw, 96px)" }}
              >
                <span className="block overflow-hidden pb-2">
                  <motion.span
                    variants={{
                      hidden: { y: "110%", opacity: 0 },
                      visible: {
                        y: "0%",
                        opacity: 1,
                        transition: {
                          duration: 0.85,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.1,
                        } as Transition,
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="block"
                  >
                    Beyond the
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-3">
                  <motion.span
                    variants={{
                      hidden: { y: "110%", opacity: 0 },
                      visible: {
                        y: "0%",
                        opacity: 1,
                        transition: {
                          duration: 0.85,
                          ease: [0.22, 1, 0.36, 1],
                          delay: 0.22,
                        } as Transition,
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="block"
                  >
                    <em className="italic text-[#185FA5]">Lecture</em>{" "}
                    <span
                      style={
                        {
                          WebkitTextStroke: "1.5px #0c0d0e",
                          color: "transparent",
                        } as React.CSSProperties
                      }
                    >
                      Hall.
                    </span>
                  </motion.span>
                </span>
              </h1>

              {/* Body */}
              <motion.p
                variants={fadeUp(0.38)}
                initial="hidden"
                animate="visible"
                className="text-[16px] font-light leading-[1.8] text-slate-500 mb-10 max-w-md"
              >
                A holistic movement balancing spiritual hunger with academic
                ambition through curated national and local programs.
              </motion.p>

              {/* Stats strip */}
              <motion.div
                variants={fadeUp(0.56)}
                initial="hidden"
                animate="visible"
                className="flex gap-10 pt-10 border-t border-slate-200"
              >
                {[
                  { n: "3", l: "Core Pillars" },
                  { n: "3", l: "Annual Events" },
                  { n: "98+", l: "Campuses" },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <p className="font-serif text-center sm:text-left text-[32px] font-light text-[#0c0d0e] leading-none tracking-tight">
                      {n}
                    </p>
                    <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-slate-400 mt-2.5 sm:mt-2">
                      {l}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: floating badge — only visible desktop, image is bg */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5,
              }}
              className="hidden lg:block self-end mb-8"
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-md"
              >
                <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-slate-400">
                  Since
                </p>
                <p className="font-serif text-[28px] font-light text-[#0C447C] leading-none mt-0.5">
                  1828
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile image — constrained, below text, proper height */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.35,
            }}
            className="lg:hidden mt-10 rounded-2xl overflow-hidden"
            style={{ height: "clamp(300px, 55vw, 360px)" }}
          >
            <img
              src={papa}
              alt="NUPS-G programs"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
        </div>
      </section>

      {/* ── 2. PILLARS ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 mb-12">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1.5px] w-8 bg-[#185FA5]" />
                <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
                  Our Pillars
                </span>
              </div>
              <h2
                className="font-serif font-light text-[#0c0d0e] leading-[0.95] tracking-tight"
                style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
              >
                Four pillars, <br />
                <em className="italic text-[#185FA5]">one mission.</em>
              </h2>
            </div>
            {/* Hint only shows on mobile/tablet where Swiper is active */}
            <span className="lg:hidden text-[12px] font-light text-slate-400 pb-2">
              Drag to explore →
            </span>
          </motion.div>
        </div>

        {/* ── Desktop: static grid ── */}
        <div className="hidden lg:grid max-w-6xl mx-auto px-6 sm:px-10 grid-cols-3 gap-4">
          {pillars.map(({ number, title, keyword, desc, bg, accent }, i) => (
            <motion.div
              key={number}
              variants={fadeUp(i * 0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden"
              style={{ background: bg, minHeight: "400px" }}
            >
              <span
                className="absolute top-4 right-6 font-serif font-light leading-none select-none pointer-events-none"
                style={{ fontSize: "120px", color: accent, opacity: 0.08 }}
              >
                {number}
              </span>
              <div>
                <span
                  className="text-[10px] font-medium tracking-[0.3em] uppercase block mb-8"
                  style={{ color: accent }}
                >
                  {number}
                </span>
                <h3
                  className="font-serif font-light text-white leading-none tracking-tight mb-3 whitespace-pre-line"
                  style={{ fontSize: "clamp(22px, 2vw, 30px)" }}
                >
                  {title}
                </h3>
                <em
                  className="font-serif italic text-[14px] font-light block mb-6"
                  style={{ color: accent, opacity: 0.7 }}
                >
                  {keyword}
                </em>
              </div>
              <div>
                <div
                  className="h-px w-full mb-6"
                  style={{ background: accent, opacity: 0.2 }}
                />
                <p className="text-[13px] font-light leading-[1.75] text-white/55">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Mobile/tablet: Swiper ── */}
        <div className="lg:hidden">
          <Swiper
            modules={[FreeMode]}
            freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6 }}
            slidesPerView="auto"
            spaceBetween={16}
            grabCursor
            breakpoints={{
              0: { slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
              640: { slidesOffsetBefore: 40, slidesOffsetAfter: 40 },
            }}
            className="pb-4!"
          >
            {pillars.map(({ number, title, keyword, desc, bg, accent }) => (
              <SwiperSlide
                key={number}
                style={{ width: "clamp(260px, 75vw, 320px)" }}
              >
                <div
                  className="relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden"
                  style={{ background: bg, minHeight: "400px" }}
                >
                  <span
                    className="absolute top-4 right-6 font-serif font-light leading-none select-none pointer-events-none"
                    style={{ fontSize: "120px", color: accent, opacity: 0.08 }}
                  >
                    {number}
                  </span>
                  <div>
                    <span
                      className="text-[10px] font-medium tracking-[0.3em] uppercase block mb-8"
                      style={{ color: accent }}
                    >
                      {number}
                    </span>
                    <h3
                      className="font-serif font-light text-white leading-none tracking-tight mb-3 whitespace-pre-line"
                      style={{ fontSize: "clamp(26px, 2.8vw, 34px)" }}
                    >
                      {title}
                    </h3>
                    <em
                      className="font-serif italic text-[14px] font-light block mb-6"
                      style={{ color: accent, opacity: 0.7 }}
                    >
                      {keyword}
                    </em>
                  </div>
                  <div>
                    <div
                      className="h-px w-full mb-6"
                      style={{ background: accent, opacity: 0.2 }}
                    />
                    <p className="text-[13px] font-light leading-[1.75] text-white/55">
                      {desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* ── 3. GATHERINGS — IMAGE CARDS ─────────────────────────────────────── */}
      <section className="bg-[#0c0d0e] relative overflow-hidden">
        {/* Decorative watermark */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none">
          <span
            className="font-sans font-black uppercase text-white opacity-[0.03] whitespace-nowrap leading-none"
            style={{ fontSize: "clamp(100px, 20vw, 240px)" }}
          >
            GATHER
          </span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-20 md:py-28">
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 pb-16 border-b border-white/[0.07]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1.5px] w-8 bg-[#85B7EB]" />
                <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB]">
                  Flagship Gatherings
                </span>
              </div>
              <h2
                className="font-serif font-light text-white leading-[0.95] tracking-tight"
                style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
              >
                Where the <br />
                family <em className="italic text-[#85B7EB]">gathers.</em>
              </h2>
            </div>
            <p className="text-[15px] font-light leading-[1.8] text-white/40 max-w-xs lg:text-right">
              National and zonal events that bring the NUPS-G family together
              across Ghana.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gatherings.map(({ name, date, loc, tag, image }, i) => (
              <motion.div
                key={name}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ minHeight: "360px" }}
              >
                {/* Background image */}
                <img
                  src={image}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(12,13,14,0.95) 0%, rgba(12,13,14,0.4) 55%, rgba(12,13,14,0.15) 100%)",
                  }}
                />

                {/* Top: Tag badge */}
                <div className="absolute top-5 left-5">
                  <span className="text-[9px] font-medium tracking-[0.25em] uppercase bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 rounded-full px-3 py-1.5">
                    {tag}
                  </span>
                </div>

                {/* Top right: index number */}
                <div className="absolute top-5 right-5">
                  <span
                    className="font-serif italic text-white/20 leading-none"
                    style={{ fontSize: "42px" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Bottom: content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Date pill */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px w-4 bg-[#85B7EB]" />
                    <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#85B7EB]">
                      {date}
                    </span>
                  </div>

                  {/* Event name */}
                  <h3
                    className="font-serif font-light text-white leading-tight tracking-tight mb-3 group-hover:text-[#85B7EB] transition-colors duration-300"
                    style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
                  >
                    {name}
                  </h3>

                  {/* Location row */}
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-light text-white/40">
                      {loc}
                    </p>
                    <div className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center group-hover:bg-[#185FA5] group-hover:border-[#185FA5] transition-all duration-200">
                      <ArrowUpRight
                        size={13}
                        className="text-white/30 group-hover:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. QUOTE BREAK ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-6 sm:px-10">
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center gap-12 md:gap-20"
        >
          {/* Large quote mark */}
          <div
            className="shrink-0 font-serif font-light text-[#185FA5] leading-none select-none"
            style={{ fontSize: "clamp(120px, 15vw, 180px)", opacity: 0.15 }}
            aria-hidden="true"
          >
            "
          </div>

          <div>
            <blockquote
              className="font-serif font-light text-[#0c0d0e] leading-[1.2] tracking-tight mb-8 text-pretty"
              style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              For Christ, we live and through every programme, every rally,
              every seminar, we prove it.
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-[1.5px] w-8 bg-[#185FA5]" />
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#185FA5]">
                NUPS-G Motto
              </span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ProgramsPage;
