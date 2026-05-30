"use no memo";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  GraduationCap,
  Phone,
  Mail,
  BookOpen,
  Shield,
  Users,
  Send,
  Loader2,
} from "lucide-react";
import { ShepherdAvatarCard } from "@/components/shepherd/profile/ShepherdAvatarCard";
import { ShepherdStats } from "@/components/shepherd/profile/ShepherdStats";
import { ShepherdDetails } from "@/components/shepherd/profile/ShepherdDetails";
import {
  useShepherdProfile,
  useUpdateShepherdProfile,
} from "@/hooks/queries/useShepherdProfile";
import BASE_API from "@/api/base.api";
import { toast } from "sonner";

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-colors placeholder:text-slate-300";

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const IconInput: React.FC<{
  icon: React.ReactNode;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}> = ({ icon, value, onChange, type = "text", placeholder, readOnly }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      {icon}
    </span>
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`${inputCls} pl-8 ${readOnly ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
    />
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  institutionName: string;
  programme: string;
  level: string;
  position: string;
};

const empty: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  institutionName: "",
  programme: "",
  level: "",
  position: "",
};

const ShepherdProfile: React.FC = () => {
  const { data: profile, isLoading } = useShepherdProfile();
  const updateProfile = useUpdateShepherdProfile();

  const [form, setForm] = useState<ProfileForm>(empty);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");

  // Populate form when profile loads
  useEffect(() => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      institutionName: profile.institutionName ?? "",
      programme: profile.programme ?? "",
      level: profile.level ?? "",
      position: profile.position ?? "",
    });
  }, [profile]);

  const set = (k: keyof ProfileForm) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    await updateProfile.mutateAsync({
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber || undefined,
      institutionName: form.institutionName || undefined,
      programme: form.programme || undefined,
      level: form.level || undefined,
      position: form.position || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    toast.success("Profile updated");
  };

  const sendReset = async () => {
    setResetting(true);
    setResetError("");
    try {
      await BASE_API.post("/auth/forgot-password", { email: form.email });
      setResetSent(true);
      setTimeout(() => setResetSent(false), 4000);
      toast.success("Reset link sent to your email");
    } catch {
      setResetError("Failed to send reset link. Try again.");
      toast.error("Failed to send reset link. Try again.");
    } finally {
      setResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={20} className="text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto px-1.5 sm:px-0">
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight">
          My Profile
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Your shepherd profile and account settings
        </p>
      </div>

      <ShepherdAvatarCard
        firstName={form.firstName}
        lastName={form.lastName}
        position={form.position}
        institution={form.institutionName}
      />

      <ShepherdStats />

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
          <h3 className="text-[15px] font-semibold text-slate-900">
            Personal Information
          </h3>
        </div>
        <div className="px-5 sm:px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name">
              <input
                value={form.firstName}
                onChange={(e) => set("firstName")(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Last Name">
              <input
                value={form.lastName}
                onChange={(e) => set("lastName")(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <IconInput
                icon={<Mail size={13} />}
                type="email"
                value={form.email}
                readOnly
              />
            </Field>
            <Field label="Phone">
              <IconInput
                icon={<Phone size={13} />}
                value={form.phoneNumber}
                onChange={set("phoneNumber")}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Academic & role */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
          <h3 className="text-[15px] font-semibold text-slate-900">
            Academic & Role
          </h3>
        </div>
        <div className="px-5 sm:px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Institution">
              <IconInput
                icon={<GraduationCap size={13} />}
                value={form.institutionName}
                onChange={set("institutionName")}
              />
            </Field>
            <Field label="Level">
              <IconInput
                icon={<Shield size={13} />}
                value={form.level}
                onChange={set("level")}
                placeholder="eg. 300"
              />
            </Field>
            <div className="col-span-1 sm:col-span-2">
              <Field label="Programme">
                <IconInput
                  icon={<BookOpen size={13} />}
                  value={form.programme}
                  onChange={set("programme")}
                />
              </Field>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Field label="Position / Role">
                <IconInput
                  icon={<Users size={13} />}
                  value={form.position}
                  onChange={set("position")}
                  placeholder="eg. Bible Study Leader"
                />
              </Field>
            </div>
          </div>
        </div>
        <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
          {saved && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[12px] font-medium text-green-600 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Changes
              saved
            </motion.p>
          )}
          {updateProfile.isError && (
            <p className="text-[12px] text-red-500">
              Failed to save. Try again.
            </p>
          )}
          <div className="ml-auto">
            <button
              onClick={save}
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                         text-white text-[13px] font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={14} /> Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Password reset */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
          <h3 className="text-[15px] font-semibold text-slate-900">
            Password Reset
          </h3>
          <p className="text-[12px] text-slate-400 mt-0.5">
            We'll send a reset link to your email
          </p>
        </div>
        <div className="px-5 sm:px-6 py-5">
          <div className="flex gap-3 flex-col sm:flex-row ">
            <IconInput
              icon={<Mail size={13} />}
              type="email"
              value={form.email}
              readOnly
            />
            <button
              onClick={sendReset}
              disabled={resetting || resetSent}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                         text-white text-[13px] font-medium rounded-xl transition-colors disabled:opacity-60 shrink-0"
            >
              {resetting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={14} />{" "}
                  {resetSent ? "Link sent!" : "Send reset link"}
                </>
              )}
            </button>
          </div>
          {resetSent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-green-600 mt-2"
            >
              ✓ Check your email — link expires in 30 minutes
            </motion.p>
          )}
          {resetError && (
            <p className="text-[11px] text-red-500 mt-2">{resetError}</p>
          )}
        </div>
      </div>

      <ShepherdDetails />
    </div>
  );
};

export default ShepherdProfile;
