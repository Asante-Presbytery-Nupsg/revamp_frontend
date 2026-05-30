import React, { useState } from "react";
import { type UseFormReturn, useFormState, useWatch } from "react-hook-form";
import FormField from "@/components/ui/FormField";
import Dropdown from "@/components/ui/Dropdown";
import SectionLabel from "./SectionLabel";
import type { MultiStepUserFormInput } from "@/schema";
import {
  useRegionsFlat,
  useRegionsSearch,
  usePresbyteriesByRegion,
} from "@/hooks/queries/useRegions";

interface Props {
  formMethods: UseFormReturn<MultiStepUserFormInput>;
}

const StepChurch: React.FC<Props> = ({ formMethods }) => {
  const { register, control } = formMethods;
  const { errors } = useFormState({ control });

  const [regionSearch, setRegionSearch] = useState("");

  // ── Regions
  const { data: regionFlat, isFetching: regionFlatLoading } = useRegionsFlat();
  const { data: regionData, isFetching: regionSearchLoading } =
    useRegionsSearch(regionSearch);

  const rawRegions = regionSearch
    ? (regionData?.data ?? [])
    : Array.isArray(regionFlat)
      ? regionFlat
      : [];

  const regionOptions = rawRegions.map((r) => ({
    label: r.name,
    value: r.id,
  }));

  // ── Presbyteries (dependent on selected region)
  const selectedRegionId = useWatch({ control, name: "regionId" }) as string;

  const { data: presbyteries, isFetching: presbyteryLoading } =
    usePresbyteriesByRegion(selectedRegionId);

  const presbyteryOptions = (presbyteries ?? []).map((p) => ({
    label: p.name,
    value: p.id,
  }));

  return (
    <div className="flex flex-col gap-7">
      <SectionLabel>Church Details</SectionLabel>
      <div className="flex flex-col gap-5">
        <FormField
          id="congregation"
          label="Congregation"
          placeholder="eg. Christ Presbyterian Church"
          registration={register("congregation", {
            required: "Congregation is required",
          })}
          error={errors.congregation}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Dropdown
            label="Region"
            name="regionId"
            control={control}
            placeholder="Select Region"
            error={errors.regionId}
            required
            onServerSearch={setRegionSearch}
            serverOptions={regionOptions}
            isServerLoading={regionFlatLoading || regionSearchLoading}
          />
          <Dropdown
            label="Presbytery"
            name="presbyteryId"
            control={control}
            options={presbyteryOptions}
            placeholder={
              !selectedRegionId
                ? "Select a region first"
                : presbyteryLoading
                  ? "Loading..."
                  : "Select Presbytery"
            }
            error={errors.presbyteryId}
            searchable
            required
          />
        </div>
        <FormField
          id="districtChurch"
          label="District Church"
          placeholder="eg. Kumasi District"
          registration={register("districtChurch", {
            required: "Church district is required",
          })}
          error={errors.districtChurch}
          required
        />
      </div>

      <SectionLabel>Guardian</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          id="guardianName"
          label="Guardian Name"
          placeholder="eg. Mr. Kwame Asante"
          registration={register("guardianName", {
            required: "Guardian name is required",
          })}
          error={errors.guardianName}
          required
        />
        <FormField
          id="guardianContact"
          label="Guardian Contact"
          placeholder="+233 24 123 4567"
          registration={register("guardianContact", {
            required: "Guardian contact is required",
          })}
          error={errors.guardianContact}
          required
        />
      </div>
    </div>
  );
};

export default StepChurch;
