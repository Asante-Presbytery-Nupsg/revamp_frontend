import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";

import {
  MultiStepUserSchema,
  type MultiStepUserFormInput,
  toPayload,
} from "@/schema";

import SidePanel from "./SidePanel";
import StepIndicator from "./StepIndicator";
import StepPersonal from "./StepPersonal";
import StepEducation from "./StepEducation";
import StepChurch from "./StepChurch";
import { STEPS, fadeUp } from "./constants";
import { useRegister } from "@/hooks/queries/useAuth";

const stepFields: Array<Array<keyof MultiStepUserFormInput>> = [
  [
    "firstName",
    "lastName",
    "otherName",
    "email",
    "phone",
    "whatsapp",
    "birthDay",
    "birthMonth",
    "password",
    "confirmPassword",
  ],
  [
    "programmeId",
    "institutionId",
    "programmeName",
    "institutionName",
    "residence",
    "highSchool",
  ],
  [
    "congregation",
    "regionId",
    "districtChurch",
    "presbyteryId",
    "guardianName",
    "guardianContact",
  ],
];

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(
    Array(STEPS.length).fill(false),
  );

  const { mutateAsync: registerUser } = useRegister();

  const formMethods = useForm<MultiStepUserFormInput>({
    resolver: zodResolver(MultiStepUserSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      otherName: "",
      email: "",
      phone: "",
      whatsapp: "",
      birthDay: undefined,
      birthMonth: undefined,
      password: "",
      confirmPassword: "",
      programmeId: "",
      institutionId: "",
      programmeName: "",
      institutionName: "",
      residence: "",
      highSchool: "",
      congregation: "",
      regionId: "",
      districtChurch: "",
      presbyteryId: "",
      guardianName: "",
      guardianContact: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = formMethods;

  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      const values = getValues();
      const progId = (values.programmeId || "").trim();
      const progName = (values.programmeName || "").trim();
      const instId = (values.institutionId || "").trim();
      const instName = (values.institutionName || "").trim();

      clearErrors([
        "programmeId",
        "programmeName",
        "institutionId",
        "institutionName",
      ]);

      let hasErrors = false;
      if (!progId && !progName) {
        setError("programmeName", {
          type: "manual",
          message: "Please select or enter a programme",
        });
        hasErrors = true;
      }
      if (!instId && !instName) {
        setError("institutionName", {
          type: "manual",
          message: "Please select or enter an institution",
        });
        hasErrors = true;
      }
      if (hasErrors) return;
    }

    const valid = await trigger(stepFields[currentStep]);
    if (!valid) return;

    setCompleted((prev) => {
      const next = [...prev];
      next[currentStep] = true;
      return next;
    });
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const onSubmit: SubmitHandler<MultiStepUserFormInput> = async (data) => {
    const payload = toPayload(data);
    console.log("Submitting payload:", payload);

    await registerUser(payload);
  };
  return (
    <div className="bg-[#fafaf9] min-h-screen flex flex-col lg:flex-row">
      <SidePanel />

      <div className="flex-1 lg:ml-90 xl:ml-105 min-h-screen">
        <div className="w-full max-w-xl mx-auto px-5 sm:px-8 py-10 lg:py-16">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden w-fit">
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
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1.5px] w-8 bg-[#185FA5]" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-[#185FA5]">
                2026 / 2027
              </span>
            </div>
            <h1
              className="font-serif font-light text-[#0c0d0e] leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(30px, 5vw, 52px)" }}
            >
              Create your <em className="italic text-[#185FA5]">account.</em>
            </h1>
          </motion.div>

          <StepIndicator currentStep={currentStep} completed={completed} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 0 && <StepPersonal formMethods={formMethods} />}
            {currentStep === 1 && <StepEducation formMethods={formMethods} />}
            {currentStep === 2 && <StepChurch formMethods={formMethods} />}

            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`inline-flex items-center gap-2 text-[13px] font-medium transition-all duration-200
                  ${currentStep === 0 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:text-[#0c0d0e]"}`}
              >
                <ArrowLeft size={15} />
                Back
              </button>

              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-[11px] font-light text-slate-400">
                  Step {currentStep + 1} of {STEPS.length}
                </span>

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-3 bg-[#0c0d0e] hover:bg-[#185FA5] text-white pl-5 pr-4 py-3 rounded-xl transition-colors duration-200"
                  >
                    <span className="text-[12px] font-medium tracking-[0.08em] uppercase">
                      Continue
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                      <ArrowRight size={13} />
                    </div>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-3 bg-[#0C447C] hover:bg-[#185FA5] text-white pl-5 pr-4 py-3 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="text-[12px] font-medium tracking-[0.08em] uppercase">
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                      <Check size={13} />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </form>

          <p className="text-[12px] font-light text-slate-400 mt-6 text-center">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-[#185FA5] hover:underline underline-offset-2"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
