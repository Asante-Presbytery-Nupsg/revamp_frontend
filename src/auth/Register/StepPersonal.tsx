import React from "react";
import { type UseFormReturn, useFormState } from "react-hook-form";
import FormField from "@/components/ui/FormField";
import Dropdown from "@/components/ui/Dropdown";
import SectionLabel from "./SectionLabel";
import { DAY_OPTIONS, MONTH_OPTIONS } from "./constants";
import type { MultiStepUserFormInput } from "@/schema";
import PasswordInput from "@/components/ui/PasswordInput";

interface Props {
  formMethods: UseFormReturn<MultiStepUserFormInput>;
}

const StepPersonal: React.FC<Props> = ({ formMethods }) => {
  const { register, control } = formMethods;
  const { errors } = useFormState({ control });

  return (
    <div className="flex flex-col gap-7">
      <SectionLabel>Full Name</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          id="firstName"
          label="First Name"
          placeholder="eg. John"
          registration={register("firstName", {
            required: "First name is required",
          })}
          error={errors.firstName}
          required
        />
        <FormField
          id="lastName"
          label="Last Name"
          placeholder="eg. Doe"
          registration={register("lastName", {
            required: "Last name is required",
          })}
          error={errors.lastName}
          required
        />
        <div className="sm:col-span-2">
          <FormField
            id="otherName"
            label="Other Name"
            placeholder="eg. Jane"
            registration={register("otherName")}
            error={errors.otherName}
          />
        </div>
      </div>
      <SectionLabel>Security</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          registration={register("password", {
            required: "Password is required",
          })}
          error={errors.password}
          required
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          registration={register("confirmPassword", {
            required: "Confirm password is required",
          })}
          error={errors.confirmPassword}
          required
        />
      </div>

      <SectionLabel>Date of Birth</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Dropdown
          label="Birth Day"
          name="birthDay"
          control={control}
          options={DAY_OPTIONS}
          placeholder="Select Day"
          error={errors.birthDay}
          required
        />
        <Dropdown
          label="Birth Month"
          name="birthMonth"
          control={control}
          options={MONTH_OPTIONS}
          placeholder="Select Month"
          error={errors.birthMonth}
          required
        />
      </div>

      <SectionLabel>Contact</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          id="email"
          label="Email Address"
          type="email"
          placeholder="john@university.edu"
          registration={register("email")}
          error={errors.email}
        />
        <FormField
          id="phone"
          label="Phone Number"
          placeholder="+233 24 123 4567"
          registration={register("phone", {
            required: "Phone number is required",
          })}
          error={errors.phone}
          required
        />
        <div className="sm:col-span-2">
          <FormField
            id="whatsapp"
            label="WhatsApp Number"
            placeholder="+233 24 123 4567"
            registration={register("whatsapp")}
            error={errors.whatsapp}
          />
        </div>
      </div>
    </div>
  );
};

export default StepPersonal;
