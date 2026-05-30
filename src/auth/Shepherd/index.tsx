import React, { useEffect, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { motion, type Variants, type Transition } from "framer-motion";
import { Check, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { ShepherdSchema, type ShepherdInput } from "@/schema/shepherd.schema";
import ShepherdForm from "./ShepherdForm";
import BASE_API from "@/api/base.api";
import Spinner from "@/components/ui/Spinner";

// ─── Animation ────────────────────────────────────────────────────────────────

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

// ─── Token State ──────────────────────────────────────────────────────────────

type TokenState =
  | { status: "loading" }
  | { status: "valid"; email: string }
  | { status: "invalid"; message: string };

// ─── Page ─────────────────────────────────────────────────────────────────────

const ShepherdRegister: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [tokenState, setTokenState] = useState<TokenState>({
    status: "loading",
  });

  const formMethods = useForm<ShepherdInput>({
    resolver: zodResolver(ShepherdSchema) as Resolver<ShepherdInput>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      institutionId: "",
      level: undefined,
      programmeId: null,
      programmeName: null,
      hostelId: null,
      hostelName: null,
      wing: null,
      position: null,
      regionId: "",
      regionName: null,
      inviteToken: token ?? "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = formMethods;

  // ── Validate invite token on mount ────────────────────────────────────────

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    BASE_API.get(`/auth/register/shepherd/validate-invite?token=${token}`)
      .then(({ data }) => {
        if (!isMounted) return;
        setTokenState({ status: "valid", email: data.data.email });
        setValue("email", data.data.email);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message =
          err?.response?.data?.message ??
          "This invite link is invalid or has expired.";
        setTokenState({ status: "invalid", message });
      });

    return () => {
      isMounted = false;
    };
  }, [token, setValue]);

  //── Guards ────────────────────────────────────────────────────────────────

  if (!token) return <Navigate to="/" replace />;

  if (tokenState.status === "loading") {
    return (
      <div className="bg-[#fafaf9] min-h-screen flex items-center justify-center">
        <Spinner size={12} />
      </div>
    );
  }

  if (tokenState.status === "invalid") {
    return (
      <div className="bg-[#fafaf9] min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <h2 className="font-serif font-light text-[#0c0d0e] text-[24px] tracking-tight mb-2">
            Invite expired
          </h2>
          <p className="text-[13px] font-light text-slate-400 leading-relaxed mb-6">
            {tokenState.message}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit: SubmitHandler<ShepherdInput> = async (data) => {
    try {
      await BASE_API.post(`/auth/register/shepherd/${token}`, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        institutionId: data.institutionId,
        programmeName: data.programmeName || undefined,
        programmeId: data.programmeId || undefined,
        hostelName: data.hostelName || undefined,
        hostelId: data.hostelId || undefined,
        level: data.level,
        position: data.position || undefined,
      });

      toast.success(
        "Registration submitted — an admin will review your account",
      );

      try {
        await BASE_API.post("/auth/logout");
      } catch {
        // ignore — cookie may not exist
      }
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? (err?.response?.data?.message ??
            "Registration failed. The link may have expired.")
          : "Registration failed. The link may have expired.";
      toast.error(message);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#fafaf9] min-h-screen">
      {/* Drifting watermark */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <motion.span
          animate={{ x: ["-16px", "16px"] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="font-sans font-black uppercase text-[#0c0d0e] opacity-[0.025] whitespace-nowrap"
          style={{ fontSize: "clamp(80px, 20vw, 260px)" }}
        >
          NUPS-G
        </motion.span>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-8 py-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
          <span className="font-serif italic font-semibold text-[18px] text-[#0C447C]">
            NUPS-G
          </span>
          <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-slate-400 ml-1">
            Ghana
          </span>
        </Link>

        {/* Heading */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1.5px] w-8 bg-[#185FA5]" />
            <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
              Shepherd Registration
            </span>
          </div>
          <h1
            className="font-serif font-light text-[#0c0d0e] leading-[0.95] tracking-tight mb-3"
            style={{ fontSize: "clamp(30px, 5vw, 52px)" }}
          >
            You've been <em className="italic text-[#185FA5]">invited.</em>
          </h1>
          <p className="text-[14px] font-light text-slate-500 max-w-md">
            Complete your registration to join as a Shepherd. Your account will
            be reviewed and activated by an admin.
          </p>
        </motion.div>

        {/* Invite badge */}
        <motion.div
          variants={fadeUp(0.08)}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-10"
        >
          <div className="w-5 h-5 rounded-full bg-[#185FA5] flex items-center justify-center shrink-0">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-[12px] font-medium text-[#185FA5]">
            Invite confirmed for{" "}
            <span className="font-semibold">{tokenState.email}</span>
          </span>
        </motion.div>

        {/* Form — parent owns the <form>, ShepherdForm is just fields */}
        <motion.form
          variants={fadeUp(0.12)}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <ShepherdForm formMethods={formMethods} />

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[12px] font-light text-slate-400">
              Your account will be reviewed before activation.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center gap-3 bg-[#0C447C] hover:bg-[#185FA5] text-white pl-6 pr-4 py-3.5 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shrink-0 w-fit"
            >
              <span className="text-[12px] font-medium tracking-[0.08em] uppercase">
                {isSubmitting ? "Submitting…" : "Complete Registration"}
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
              </div>
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ShepherdRegister;
