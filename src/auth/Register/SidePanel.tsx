import React from "react";
import { Link } from "react-router-dom";

const SidePanel: React.FC = () => (
  <div className="hidden lg:flex flex-col justify-between bg-[#0C447C] w-90 xl:w-105 shrink-0 px-12 py-16 fixed top-0 left-0 h-screen overflow-hidden z-10">
    {/* Watermark */}
    <div className="absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none select-none">
      <span
        className="font-sans font-black uppercase text-white opacity-[0.04] leading-none translate-y-[20%]"
        style={{ fontSize: "150px" }}
      >
        1828
      </span>
    </div>

    {/* Logo */}
    <Link to="/" className="flex flex-col leading-none w-fit">
      <span className="font-serif italic font-semibold text-[20px] text-white tracking-tight">
        NUPS-G
      </span>
      <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/35 mt-0.5">
        Ghana
      </span>
    </Link>

    {/* Headline */}
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-[1.5px] w-6 bg-[#85B7EB]" />
        <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB]">
          2026 Registration
        </span>
      </div>
      <h2
        className="font-serif font-light text-white leading-none tracking-tight mb-5"
        style={{ fontSize: "clamp(30px, 3vw, 44px)" }}
      >
        Begin your <br />
        <em className="italic text-[#85B7EB]">journey</em> <br />
        with us.
      </h2>
      <p className="text-[13px] font-light leading-[1.8] text-white/45 max-w-60">
        Join thousands of Presbyterian students across Ghana. Takes less than 3
        minutes.
      </p>
    </div>

    {/* Stats */}
    <div className="relative z-10 flex gap-7 pt-7 border-t border-white/10">
      {[
        { n: "98+", l: "Campuses" },
        { n: "16", l: "Regions" },
        { n: "1828", l: "Founded" },
      ].map(({ n, l }) => (
        <div key={l}>
          <p className="font-serif text-[24px] font-light text-white leading-none">
            {n}
          </p>
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/30 mt-1">
            {l}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default SidePanel;
