import React from "react";
import { type UseFormReturn, useFormState } from "react-hook-form";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import PasswordInput from "@/components/ui/PasswordInput";
import type { LoginInput } from "@/schema/login.schema";

interface Props {
  formMethods: UseFormReturn<LoginInput>;
}

const LoginForm: React.FC<Props> = ({ formMethods }) => {
  const { register, control } = formMethods;
  const { errors, isSubmitting } = useFormState({ control });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <FormField
          id="identifier"
          label="Email or Phone Number"
          placeholder="john@university.edu or +233 24 123 4567"
          registration={register("identifier", { required: true })}
          error={errors.identifier}
          required
        />
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          registration={register("password", { required: true })}
          error={errors.password}
          required
        />
      </div>

      {/* Forgot password */}
      <div className="flex justify-end -mt-2">
        <Link
          to="/forgot-password"
          className="text-[12px] font-medium text-slate-400 hover:text-[#185FA5] transition-colors underline-offset-2 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group w-full inline-flex items-center justify-between bg-[#0c0d0e] hover:bg-[#185FA5] text-white pl-6 pr-4 py-3.5 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="text-[13px] font-medium tracking-[0.08em] uppercase">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </span>
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
          <ArrowRight size={14} />
        </div>
      </button>
    </div>
  );
};

export default LoginForm;
