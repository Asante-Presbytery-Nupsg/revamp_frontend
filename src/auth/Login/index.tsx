import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { motion, type Variants, type Transition } from "framer-motion";

import { LoginSchema, type LoginInput } from "@/schema/login.schema";
import LoginForm from "./LoginForm";
import { useLogin } from "@/hooks/queries/useAuth";

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay,
    } as Transition,
  },
});

const LoginPage: React.FC = () => {
  const { mutateAsync: loginUser } = useLogin();

  const formMethods = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    await loginUser(data);
  };

  return (
    <div className="bg-[#fafaf9] min-h-screen flex flex-col lg:flex-row">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0C447C] w-90 xl:w-105 shrink-0 px-12 py-16 fixed top-0 left-0 h-screen overflow-hidden z-10">
        <div className="absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none select-none">
          <span
            className="font-sans font-black uppercase text-white opacity-[0.04] leading-none translate-y-[20%]"
            style={{ fontSize: "150px" }}
          >
            1828
          </span>
        </div>

        <Link to="/" className="flex flex-col leading-none w-fit">
          <span className="font-serif italic font-semibold text-[20px] text-white tracking-tight">
            NUPS-G
          </span>
          <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/35 mt-0.5">
            Ghana
          </span>
        </Link>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1.5px] w-6 bg-[#85B7EB]" />
            <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#85B7EB]">
              Welcome Back
            </span>
          </div>
          <h2
            className="font-serif font-light text-white leading-none tracking-tight mb-5"
            style={{ fontSize: "clamp(30px, 3vw, 44px)" }}
          >
            Good to see <br />
            you <em className="italic text-[#85B7EB]">again.</em>
          </h2>
          <p className="text-[13px] font-light leading-[1.8] text-white/45 max-w-60">
            Sign in to access your NUPS-G dashboard and connect with your campus
            community.
          </p>
        </div>

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

      {/* ── Right panel ── */}
      <div className="flex-1 lg:ml-90 xl:ml-105 min-h-screen flex items-center">
        <div className="w-full max-w-md mx-auto px-5 sm:px-8 py-14">
          {/* Mobile logo */}
          <Link
            to="/"
            className="flex items-center gap-2 mb-10 lg:hidden w-fit"
          >
            <span className="font-serif italic font-semibold text-[18px] text-[#0C447C]">
              NUPS-G
            </span>
            <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-slate-400 ml-1">
              Ghana
            </span>
          </Link>

          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1.5px] w-8 bg-[#185FA5]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
                Sign In
              </span>
            </div>
            <h1
              className="font-serif font-light text-[#0c0d0e] leading-[0.95] tracking-tight mb-2"
              style={{ fontSize: "clamp(30px, 5vw, 48px)" }}
            >
              Welcome <em className="italic text-[#185FA5]">back.</em>
            </h1>
          </motion.div>

          <motion.form
            variants={fadeUp(0.1)}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <LoginForm formMethods={formMethods} />
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
