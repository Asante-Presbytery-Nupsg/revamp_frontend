import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/NUPSGLOGO.svg";

const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Local Branches", to: "/branches" },
  { label: "Events", to: "/events" },
  { label: "Leadership", to: "/leadership" },
];

const SOCIALS = [
  { Icon: FaFacebookF, href: "#", label: "Facebook" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaYoutube, href: "#", label: "YouTube" },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0C447C] border-t border-[#0C447C] pt-20 pb-10 overflow-hidden">
      {/* Watermark */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="font-sans font-black uppercase text-white opacity-[0.04] leading-none translate-y-[15%]"
          style={{ fontSize: "clamp(80px, 18vw, 220px)" }}
        >
          NUPS-G
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-5 space-y-7">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img
                src={logo}
                alt="NUPS-G"
                className="w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="flex flex-col leading-none">
                <span className="font-serif italic font-semibold text-[19px] text-white tracking-tight">
                  NUPS-G
                </span>
                <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/40 mt-0.5">
                  Ghana
                </span>
              </div>
            </Link>

            <p className="font-serif text-[clamp(17px,2vw,21px)] font-light leading-snug text-white max-w-70">
              The National Union of{" "}
              <em className="italic text-[#85B7EB]">Presbyterian Students</em> —
              Ghana.
            </p>

            <p className="text-[14px] font-light leading-[1.8] text-white/50 max-w-75">
              Walking alongside Presbyterian students through every chapter of
              their academic journey since 1828.
            </p>

            {/* Socials */}
            <div className="flex gap-2.5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/40 hover:bg-white hover:text-[#0C447C] hover:border-white transition-all duration-300"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Directory */}
          <div className="md:col-span-3 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-[1.5px] w-6 bg-[#85B7EB]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB]">
                Directory
              </span>
            </div>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-[13px] font-light text-white/50 hover:text-white transition-colors duration-200"
                  >
                    <ArrowRight
                      size={12}
                      className="text-white/25 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-[1.5px] w-6 bg-[#85B7EB]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB]">
                Headquarters
              </span>
            </div>
            <div className="space-y-3">
              <p className="font-serif italic text-[17px] font-light text-white">
                Kumasi, Ashanti Region
              </p>
              <p className="text-[13px] font-light text-white/50 leading-relaxed">
                General Enquiries
                <br />
                <a
                  href="mailto:info@nupsg.org"
                  className="text-[#85B7EB] hover:text-white transition-colors duration-200"
                >
                  info@nupsg.org
                </a>
              </p>
              <p className="text-[13px] font-light text-white/50">
                +233 (0) 24 XXX XXXX
              </p>
            </div>

            {/* Newsletter nudge */}
            <div className="pt-2">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/35 mb-3">
                Stay Updated
              </p>
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-white hover:bg-[#E6F1FB] text-[#0C447C] text-[11px] font-medium px-4 py-2.5 rounded-xl transition-colors duration-200"
              >
                Join our mailing list
                <ArrowRight
                  size={11}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-light text-white/30 tracking-wide">
            © {year} National Union of Presbyterian Students – Ghana
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] font-light text-white/30 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
