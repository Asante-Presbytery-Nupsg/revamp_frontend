import React, { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ShepherdInput } from "@/schema/shepherd.schema";
import FormField from "@/components/ui/FormField";
import Dropdown from "@/components/ui/Dropdown";
import BASE_API from "@/api/base.api";
import PasswordInput from "@/components/ui/PasswordInput";

interface LookupItem {
  id: string;
  name: string;
  shortName?: string;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">
    {children}
  </h3>
);

const ShepherdForm: React.FC<{
  formMethods: UseFormReturn<ShepherdInput>;
}> = ({ formMethods }) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  const [institutions, setInstitutions] = useState<LookupItem[]>([]);
  const [programmes, setProgrammes] = useState<LookupItem[]>([]);
  const [regions, setRegions] = useState<LookupItem[]>([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      BASE_API.get("/institutions?flat=true").then(
        ({ data }) => data.data ?? [],
      ),
      BASE_API.get("/programmes?flat=true").then(({ data }) => data.data ?? []),
      BASE_API.get("/regions?flat=true").then(({ data }) => data.data ?? []),
    ])
      .then(([inst, prog, reg]) => {
        if (!mounted) return;
        setInstitutions(inst);
        setProgrammes(prog);
        setRegions(reg);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const institutionOptions = institutions.map((i) => ({
    value: i.id,
    label: i.shortName ? `${i.shortName} - ${i.name}` : i.name,
  }));

  const programmeOptions = programmes.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const regionOptions = regions.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const levelOptions = [100, 200, 300, 400, 500, 600].map((l) => ({
    value: String(l),
    label: `Level ${l}`,
  }));

  // Sync programme name when ID is selected
  const selectedProgrammeId = watch("programmeId");
  useEffect(() => {
    if (!selectedProgrammeId) return;
    const match = programmes.find((p) => p.id === selectedProgrammeId);
    if (match) setValue("programmeName", match.name);
  }, [selectedProgrammeId, programmes, setValue]);

  // Sync region name when ID is selected
  const selectedRegionId = watch("regionId");
  useEffect(() => {
    if (!selectedRegionId) return;
    const match = regions.find((r) => r.id === selectedRegionId);
    if (match) setValue("regionName", match.name);
  }, [selectedRegionId, regions, setValue]);

  const emailValue = watch("email");

  return (
    <div className="flex flex-col gap-6">
      {/* Personal */}
      <div>
        <SectionTitle>Personal Details</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="First Name"
            placeholder="e.g. Ama"
            registration={register("firstName", {
              required: "First name is required",
            })}
            error={errors.firstName}
            required
          />
          <FormField
            id="lastName"
            label="Last Name"
            placeholder="e.g. Owusu"
            registration={register("lastName", {
              required: "Last name is required",
            })}
            error={errors.lastName}
            required
          />
          <FormField
            id="email"
            label="Email Address"
            type="email"
            value={emailValue}
            placeholder="kofi@nupsg.org"
            registration={register("email", { required: "Email is required" })}
            error={errors.email}
            required
            readOnly
          />
          <FormField
            id="phone"
            label="Phone"
            placeholder="+233 24 123 4567"
            registration={register("phone", {
              required: "Phone number is required",
            })}
            error={errors.phone}
            required
          />
        </div>
      </div>

      {/* Academic */}
      <div>
        <SectionTitle>Academic Details</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            label="Institution"
            name="institutionId"
            control={control}
            options={institutionOptions}
            placeholder="Select institution"
            error={errors.institutionId}
            searchable
            required
          />
          <Dropdown
            label="Programme"
            name="programmeId"
            control={control}
            options={programmeOptions}
            placeholder="Select programme"
            error={errors.programmeId}
            searchable
          />
          <Dropdown
            label="Level"
            name="level"
            control={control}
            options={levelOptions}
            placeholder="Select level"
            error={errors.level}
            required
          />
          <FormField
            id="hostelName"
            label="Hostel / Residence"
            placeholder="e.g. Unity Hall"
            registration={register("hostelName")}
            error={errors.hostelName}
          />
        </div>
      </div>

      {/* Shepherd Role */}
      <div>
        <SectionTitle>Shepherd Role</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            label="Region"
            name="regionId"
            control={control}
            options={regionOptions}
            placeholder="Select region"
            error={errors.regionId}
            searchable
            required
          />
          <FormField
            id="position"
            label="Position (optional)"
            placeholder="e.g. Zone Leader"
            registration={register("position")}
            error={errors.position}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <SectionTitle>Set Password</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default ShepherdForm;
