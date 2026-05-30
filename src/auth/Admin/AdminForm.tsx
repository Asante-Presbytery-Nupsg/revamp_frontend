// src/pages/auth/admin-register/AdminForm.tsx
import React from "react";
import { type UseFormReturn, useFormState } from "react-hook-form";
import FormField from "@/components/ui/FormField";
import PasswordInput from "@/components/ui/PasswordInput";
import type { AdminInput } from "@/schema/admin.schema";

interface Props {
  formMethods: UseFormReturn<AdminInput>;
  emailReadOnly?: boolean;
}

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <div className="flex items-center gap-3 mb-5">
      <div className="h-[1.5px] w-5 bg-[#185FA5]" />
      <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#185FA5]">
        {label}
      </span>
    </div>
    {children}
  </div>
);

const AdminForm: React.FC<Props> = ({ formMethods, emailReadOnly }) => {
  const { register, control } = formMethods;
  const { errors } = useFormState({ control });

  return (
    <div className="flex flex-col gap-7">
      <Section label="Personal">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            id="firstName"
            label="First Name"
            placeholder="eg. Kofi"
            registration={register("firstName")}
            error={errors.firstName}
            required
          />
          <FormField
            id="lastName"
            label="Last Name"
            placeholder="eg. Mensah"
            registration={register("lastName")}
            error={errors.lastName}
            required
          />
          <FormField
            id="email"
            label="Email Address"
            type="email"
            placeholder="kofi@nupsg.org"
            registration={register("email")}
            error={errors.email}
            required
            readOnly={emailReadOnly}
            className={
              emailReadOnly
                ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                : undefined
            }
          />
          <FormField
            id="phone"
            label="Phone Number"
            placeholder="+233 24 123 4567"
            registration={register("phone")}
            error={errors.phone}
            required
          />
        </div>
      </Section>

      <Section label="Password">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Min. 8 characters"
            registration={register("password")}
            error={errors.password}
            required
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter password"
            registration={register("confirmPassword")}
            error={errors.confirmPassword}
            required
          />
        </div>
      </Section>
    </div>
  );
};

export default AdminForm;
