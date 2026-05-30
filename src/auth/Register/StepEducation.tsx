import React, { useState } from "react";
import { type UseFormReturn, useFormState } from "react-hook-form";
import FormField from "@/components/ui/FormField";
import Dropdown from "@/components/ui/Dropdown";
import SectionLabel from "./SectionLabel";
import type { MultiStepUserFormInput } from "@/schema";
import {
  useInstitutionsFlat,
  useInstitutionsSearch,
} from "@/hooks/queries/useInstitutions";
import {
  useProgrammesFlat,
  useProgrammesSearch,
} from "@/hooks/queries/useProgrammes";
import type { Institution } from "@/api/institutions.api";
import type { Programme } from "@/api/programmes.api";

interface Props {
  formMethods: UseFormReturn<MultiStepUserFormInput>;
}

const StepEducation: React.FC<Props> = ({ formMethods }) => {
  const { register, control } = formMethods;
  const { errors } = useFormState({ control });

  const [instSearch, setInstSearch] = useState("");
  const [progSearch, setProgSearch] = useState("");

  const { data: instFlat } = useInstitutionsFlat();
  const { data: instData, isFetching: instLoading } =
    useInstitutionsSearch(instSearch);

  const { data: progFlat } = useProgrammesFlat();
  const { data: progData, isFetching: progLoading } =
    useProgrammesSearch(progSearch);

  const rawInstitutions: Institution[] = instSearch
    ? (instData?.data ?? [])
    : (instFlat ?? []);

  const rawProgrammes: Programme[] = progSearch
    ? (progData?.data ?? [])
    : (progFlat ?? []);

  const institutionOptions = rawInstitutions.map((i) => ({
    label: i.name,
    value: i.id,
  }));

  const programmeOptions = rawProgrammes.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  return (
    <div className="flex flex-col gap-7">
      <SectionLabel>Institution</SectionLabel>
      <div className="flex flex-col gap-5">
        <Dropdown
          label="Institution"
          name="institutionId"
          control={control}
          placeholder="Search institution..."
          error={errors.institutionId}
          onServerSearch={setInstSearch}
          serverOptions={institutionOptions}
          isServerLoading={instLoading}
        />
        <FormField
          id="institutionName"
          label="Or enter institution name"
          placeholder="If not listed above"
          registration={register("institutionName")}
          error={errors.institutionName}
        />
      </div>

      <SectionLabel>Programme</SectionLabel>
      <div className="flex flex-col gap-5">
        <Dropdown
          label="Programme"
          name="programmeId"
          control={control}
          placeholder="Search programme..."
          error={errors.programmeId}
          onServerSearch={setProgSearch}
          serverOptions={programmeOptions}
          isServerLoading={progLoading}
        />
        <FormField
          id="programmeName"
          label="Or enter programme name"
          placeholder="If not listed above"
          registration={register("programmeName")}
          error={errors.programmeName}
        />
      </div>

      <SectionLabel>Background</SectionLabel>
      <div className="flex flex-col gap-5">
        <FormField
          id="highSchool"
          label="High School Attended"
          placeholder="eg. Achimota School"
          registration={register("highSchool", {
            required: "High school is required",
          })}
          error={errors.highSchool}
          required
        />
        <FormField
          id="residence"
          label="Campus Residence"
          placeholder="eg. Katanga Hall"
          registration={register("residence")}
          error={errors.residence}
        />
      </div>
    </div>
  );
};

export default StepEducation;
