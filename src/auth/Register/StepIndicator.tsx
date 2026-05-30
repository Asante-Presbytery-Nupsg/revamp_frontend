import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { STEPS } from "./constants";

interface StepIndicatorProps {
  currentStep: number;
  completed: boolean[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completed,
}) => {
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-slate-100 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-[#185FA5] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Step pills */}
      <div className="flex items-center gap-3">
        {STEPS.map((step, i) => {
          const isActive = i === currentStep;
          const isDone = completed[i];
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center
                    text-[11px] font-medium shrink-0 transition-all duration-300
                    ${
                      isDone
                        ? "bg-[#185FA5] text-white"
                        : isActive
                          ? "bg-[#0c0d0e] text-white"
                          : "bg-slate-100 text-slate-400"
                    }
                  `}
                >
                  {isDone ? <Check size={12} strokeWidth={2.5} /> : step.id}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={`text-[12px] font-medium leading-none ${
                      isActive
                        ? "text-[#0c0d0e]"
                        : isDone
                          ? "text-[#185FA5]"
                          : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] font-light text-slate-400 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px transition-colors duration-300 ${
                    completed[i] ? "bg-[#185FA5]/40" : "bg-slate-100"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
