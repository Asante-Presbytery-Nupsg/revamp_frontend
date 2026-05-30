import { useState, useEffect } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Field, Section, SelectField, inputCls } from "./SettingsPrimitives";
import {
  useOrgSettings,
  useUpdateOrgSettings,
} from "@/hooks/queries/useSettings";

const REGION_OPTIONS = [
  { value: "ashanti", label: "Ashanti" },
  { value: "greater-accra", label: "Greater Accra" },
  { value: "central", label: "Central" },
  { value: "western", label: "Western" },
  { value: "eastern", label: "Eastern" },
  { value: "volta", label: "Volta" },
  { value: "northern", label: "Northern" },
  { value: "brong-ahafo", label: "Brong-Ahafo" },
];

type OrgForm = {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  website: string;
};

export const OrgTab: React.FC = () => {
  const { data, isLoading } = useOrgSettings();
  const update = useUpdateOrgSettings();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<OrgForm>({
    name: "",
    shortName: "",
    email: "",
    phone: "",
    address: "",
    region: "ashanti",
    website: "",
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = (k: keyof OrgForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await update.mutateAsync(form);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="text-slate-300 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <Section title="Organisation Logo">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F1FB] border-2 border-dashed border-[#185FA5]/30 flex items-center justify-center shrink-0">
            <Building2 size={24} className="text-[#185FA5]/40" />
          </div>
          <div>
            <button className="px-4 py-2 text-[12px] font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Upload Logo
            </button>
            <p className="text-[11px] text-slate-400 mt-1.5">
              PNG or SVG, max 2MB. Recommended 512×512.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Organisation Details"
        desc="Information about your union chapter"
        onSave={save}
        saving={saving}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field label="Full Name">
              <input
                value={form.name}
                onChange={set("name")}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Short Name / Code">
            <input
              value={form.shortName}
              onChange={set("shortName")}
              className={inputCls}
            />
          </Field>
          <SelectField
            label="Region"
            value={form.region}
            onChange={(v) => setForm((f) => ({ ...f, region: v }))}
            options={REGION_OPTIONS}
          />
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={set("phone")}
              className={inputCls}
            />
          </Field>
          <Field label="Address">
            <input
              value={form.address}
              onChange={set("address")}
              className={inputCls}
            />
          </Field>
          <Field label="Website">
            <input
              value={form.website}
              onChange={set("website")}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>
    </div>
  );
};

export default OrgTab;
