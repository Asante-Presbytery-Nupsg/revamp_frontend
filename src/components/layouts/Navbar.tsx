import { useState } from "react";
import logo from "@/assets/NUPSGLOGO.svg";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Contact", to: "/contact" },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-100 bg-white/80 backdrop-blur-xl border-b border-slate-100/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-2 py-4">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 flex items-center justify-center">
              <img
                src={logo}
                alt="NUPS-G"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif italic font-semibold text-[17px] text-[#0C447C] tracking-tight">
                NUPS-G
              </span>
              <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-slate-400 mt-0.5">
                Ghana
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`
                  relative px-4 py-2.5 text-[12px] tracking-wide
                  transition-all duration-200
                  ${
                    isActive(to)
                      ? "text-[#0C447C] font-semibold"
                      : "text-slate-500 font-medium hover:text-slate-900"
                  }
                `}
              >
                {label}
                {isActive(to) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#185FA5] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link to="/register">
              <button className="group inline-flex items-center gap-2 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[12px] font-medium px-5 py-2.5 rounded-xl transition-colors duration-200">
                Register
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute top-full left-0 right-0 border-t border-slate-100 bg-white shadow-sm shadow-gray-100 border-b z-50"
            >
              {/* Links */}
              <div className="px-4 py-2">
                {NAV_LINKS.map(({ label, to }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.04 }}
                  >
                    <Link
                      to={to}
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center justify-between px-4 py-3.5 rounded-xl
                        text-[14px] transition-all duration-150
                        ${
                          isActive(to)
                            ? "text-[#0C447C] font-semibold bg-blue-50"
                            : "text-slate-700 font-medium hover:bg-slate-50"
                        }
                      `}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA row */}
              <div className="px-4 pb-5 pt-2 border-t border-slate-100">
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="flex flex-col gap-2 mt-2"
                >
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <button className="w-full py-3 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group">
                      Register
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 text-center text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-99 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
