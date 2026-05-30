import { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Field, Section, inputCls } from "./SettingsPrimitives";
import {
  useAdminProfile,
  useUpdateAdminProfile,
  useSendPasswordReset,
} from "@/hooks/queries/useSettings";

export const ProfileTab: React.FC = () => {
  const { data: profile, isLoading } = useAdminProfile();
  const update = useUpdateAdminProfile();
  const sendReset = useSendPasswordReset();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (profile)
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phoneNumber ?? "",
      });
  }, [profile]);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await update.mutateAsync({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phone || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!profile?.email) return;
    await sendReset.mutateAsync(profile.email);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  };

  const initials =
    `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`.toUpperCase() || "—";
  const fullName =
    [form.firstName, form.lastName].filter(Boolean).join(" ") ||
    "Administrator";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Profile Photo">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F1FB] flex items-center justify-center">
              <span className="text-[20px] font-bold text-[#185FA5]">
                {initials}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0C447C] text-white flex items-center justify-center shadow-sm hover:bg-[#185FA5] transition-colors">
              <Camera size={11} />
            </button>
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-900">{fullName}</p>
            <p className="text-[12px] text-slate-400 mt-0.5">Administrator</p>
            <button className="text-[12px] text-[#185FA5] hover:underline underline-offset-2 mt-1">
              Upload new photo
            </button>
          </div>
        </div>
      </Section>

      <Section
        title="Personal Information"
        desc="Your name and contact details"
        onSave={save}
        saving={saving}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="First Name">
            <input
              value={form.firstName}
              onChange={set("firstName")}
              className={inputCls}
            />
          </Field>
          <Field label="Last Name">
            <input
              value={form.lastName}
              onChange={set("lastName")}
              className={inputCls}
            />
          </Field>
          <Field label="Email Address">
            <input
              type="email"
              value={form.email}
              readOnly
              className={`${inputCls} bg-slate-50 text-slate-500 cursor-not-allowed`}
            />
          </Field>
          <Field label="Phone Number">
            <input
              value={form.phone}
              onChange={set("phone")}
              placeholder="+233..."
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Password Reset"
        desc="We'll send a reset link to your email address"
      >
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="email"
            value={profile?.email ?? ""}
            readOnly
            className={`${inputCls} flex-1 bg-slate-50 text-slate-500 cursor-not-allowed`}
          />
          <button
            onClick={handleReset}
            disabled={sendReset.isPending || resetSent}
            className="px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors shrink-0 disabled:opacity-60"
          >
            {sendReset.isPending
              ? "Sending…"
              : resetSent
                ? "Sent!"
                : "Send reset link"}
          </button>
        </div>
        {resetSent && (
          <p className="text-[11px] text-green-600 mt-2">
            ✓ Check your email — link expires in 30 minutes
          </p>
        )}
        {!resetSent && (
          <p className="text-[11px] text-slate-400 mt-2">
            A password reset link will be sent to your registered email. The
            link expires in 30 minutes.
          </p>
        )}
      </Section>
    </div>
  );
};

export default ProfileTab;
