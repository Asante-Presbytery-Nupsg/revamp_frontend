import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Home,
  Users,
  CalendarCheck,
  TrendingUp,
  Heart,
  Church,
  Loader2,
  Cake,
  Clock,
  Pencil,
} from "lucide-react";
import {
  useMyProfile,
  useUpdateMyProfile,
} from "@/hooks/queries/useSheepProfile";

// ─── Primitives ───────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-all placeholder:text-slate-300";

const IconField: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}> = ({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly,
}) => (
  <div>
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {label}
    </label>
    <div className="relative group">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-[#185FA5]">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inputCls} pl-9 ${readOnly ? "bg-slate-50/80 text-slate-500 cursor-default border-slate-100" : ""}`}
      />
      {!readOnly && (
        <Pencil
          size={10}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-focus-within:opacity-100 transition-opacity"
        />
      )}
    </div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const SheepProfile: React.FC = () => {
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const [edits, setEdits] = useState<Record<string, string>>({});

  const get = (key: string, serverValue: string | null | undefined) =>
    key in edits ? edits[key] : (serverValue ?? "");

  const set = (key: string) => (value: string) =>
    setEdits((prev) => ({ ...prev, [key]: value }));

  const firstName = get("firstName", profile?.firstName);
  const lastName = get("lastName", profile?.lastName);
  const phone = get("phone", profile?.phone);
  const residence = get("residence", profile?.residence);
  const whatsapp = get("whatsapp", profile?.whatsapp);
  const guardianName = get("guardianName", profile?.guardianName);
  const guardianContact = get("guardianContact", profile?.guardianContact);
  const institution = get("institution", profile?.institution);
  const programme = get("programme", profile?.programme);
  const highSchool = get("highSchool", profile?.highSchool);
  const congregation = get("congregation", profile?.congregation);
  const districtChurch = get("districtChurch", profile?.districtChurch);

  const initials = `${(firstName[0] ?? "").toUpperCase()}${(lastName[0] ?? "").toUpperCase()}`;
  const hasEdits = Object.keys(edits).length > 0;

  const save = () => {
    const payload: Record<string, string> = {};
    if (edits.firstName !== undefined) payload.firstName = edits.firstName;
    if (edits.lastName !== undefined) payload.lastName = edits.lastName;
    if (edits.email !== undefined) payload.email = edits.email;
    if (edits.phone !== undefined) payload.phoneNumber = edits.phone;
    if (edits.residence !== undefined) payload.residence = edits.residence;
    if (edits.whatsapp !== undefined) payload.whatsapp = edits.whatsapp;
    if (edits.guardianName !== undefined)
      payload.guardianName = edits.guardianName;
    if (edits.guardianContact !== undefined)
      payload.guardianContact = edits.guardianContact;
    if (edits.institution !== undefined)
      payload.institution = edits.institution;
    if (edits.programme !== undefined) payload.programme = edits.programme;
    if (edits.highSchool !== undefined) payload.highSchool = edits.highSchool;
    if (edits.congregation !== undefined)
      payload.congregation = edits.congregation;
    if (edits.districtChurch !== undefined)
      payload.districtChurch = edits.districtChurch;

    if (Object.keys(payload).length === 0) return;
    updateProfile.mutate(payload, { onSuccess: () => setEdits({}) });
  };

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-5 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-52 bg-white rounded-2xl border border-slate-100 animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white rounded-xl border border-slate-100 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse" />
      </div>
    );
  }

  // ── Derived display ─────────────────────────────────────────────────
  const birthday =
    profile?.birthDay && profile?.birthMonth
      ? `${MONTH_SHORT[profile.birthMonth - 1]} ${profile.birthDay}`
      : null;

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const rateColor =
    (profile?.attendanceRate ?? 0) >= 75
      ? "text-green-600"
      : (profile?.attendanceRate ?? 0) >= 50
        ? "text-amber-600"
        : "text-red-500";

  const rateBg =
    (profile?.attendanceRate ?? 0) >= 75
      ? "bg-green-50"
      : (profile?.attendanceRate ?? 0) >= 50
        ? "bg-amber-50"
        : "bg-red-50";

  // Tags for the hero card
  const tags = [profile?.institution, profile?.programme].filter(Boolean);

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight">
          My Profile
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Your personal information and membership details
        </p>
      </div>

      {/* ── Hero Card ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm shadow-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Accent: Identity Block */}
          <div className="md:w-48 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-6 flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-lg bg-white border border-slate-200  flex items-center justify-center shrink-0">
              <span className="text-[26px] font-bold text-[#0C447C]">
                {initials}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm shadow-gray-50">
              <span
                className={`w-1.5 h-1.5 rounded-full ${profile?.isActive ? "bg-green-500" : "bg-slate-300"}`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${profile?.isActive ? "text-green-700" : "text-slate-400"}`}
              >
                {profile?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Main Content: Info & Tags */}
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-[22px] sm:text-[24px] font-semibold text-slate-800 tracking-tight leading-none">
                  {firstName} {lastName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                  {birthday && (
                    <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
                      <Cake size={14} className="text-slate-400" />
                      {birthday}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
                    <Clock size={14} className="text-slate-400" />
                    Member since {memberSince}
                  </div>
                </div>
              </div>

              {/* Quick Action / Status Badge */}
              <div className="hidden sm:block">
                <span className="px-3 py-1.5 bg-[#F1F5F9] text-slate-600 text-[10px] font-black uppercase tracking-[0.15em] rounded-lg border border-slate-200">
                  ID: {profile?.id?.substring(0, 8).toUpperCase() || "N/A"}
                </span>
              </div>
            </div>

            {/* Tags Section: Styled as Welfare Badges */}
            <div className="pt-2 border-t border-slate-50 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#E6F1FB] border border-[#185FA5]/10 text-[#185FA5] text-[11px] font-bold rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Sessions */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#E6F1FB] text-[#185FA5] flex items-center justify-center shrink-0">
            <CalendarCheck size={18} />
          </div>
          <div>
            <p className="text-[22px] font-serif font-light text-[#0c0d0e] leading-none">
              {profile?.sessionsAttended ?? 0}
              <span className="text-[13px] text-slate-400 font-sans ml-1">
                / {profile?.totalSessions ?? 0}
              </span>
            </p>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Sessions attended
            </p>
          </div>
        </div>

        {/* Rate */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl ${rateBg} ${rateColor} flex items-center justify-center shrink-0`}
          >
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[22px] font-serif font-light text-[#0c0d0e] leading-none">
                {profile?.attendanceRate ?? 0}%
              </p>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-20">
                <div
                  className={`h-full rounded-full ${
                    (profile?.attendanceRate ?? 0) >= 75
                      ? "bg-green-500"
                      : (profile?.attendanceRate ?? 0) >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${profile?.attendanceRate ?? 0}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Attendance rate
            </p>
          </div>
        </div>

        {/* Shepherd */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#E6F1FB] text-[#185FA5] flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-slate-900 leading-tight">
              {profile?.shepherdName ?? "Unassigned"}
            </p>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              My shepherd
            </p>
          </div>
        </div>
      </div>

      {/* ── Personal Info (editable) ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">
              Personal Information
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Update your contact details
            </p>
          </div>
          <span className="text-[10px] font-medium text-[#185FA5] bg-[#E6F1FB] px-2 py-0.5 rounded-full">
            Editable
          </span>
        </div>
        <div className="px-5 sm:px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconField
              label="First Name"
              icon={<Users size={13} />}
              value={firstName}
              onChange={set("firstName")}
            />
            <IconField
              label="Last Name"
              icon={<Users size={13} />}
              value={lastName}
              onChange={set("lastName")}
            />
            <IconField
              label="Phone"
              icon={<Phone size={13} />}
              value={phone}
              onChange={set("phone")}
            />
            <IconField
              label="Email"
              icon={<Mail size={13} />}
              value={profile?.email ?? "—"}
              onChange={() => {}}
              readOnly
            />
            <IconField
              label="WhatsApp"
              icon={<Phone size={13} />}
              value={whatsapp}
              onChange={set("whatsapp")}
            />
            <IconField
              label="Hostel / Residence"
              icon={<Home size={13} />}
              value={residence}
              onChange={set("residence")}
            />
          </div>
        </div>
      </div>

      {/* ── Guardian Info (editable) ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">
              Guardian / Emergency Contact
            </h3>
          </div>
          <span className="text-[10px] font-medium text-[#185FA5] bg-[#E6F1FB] px-2 py-0.5 rounded-full">
            Editable
          </span>
        </div>
        <div className="px-5 sm:px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconField
              label="Guardian Name"
              icon={<Heart size={13} />}
              value={guardianName}
              onChange={set("guardianName")}
            />
            <IconField
              label="Guardian Contact"
              icon={<Phone size={13} />}
              value={guardianContact}
              onChange={set("guardianContact")}
            />
          </div>
        </div>
      </div>

      {/* ── Academic + Church (editable by sheep) ─────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">
              Academic &amp; Church Details
            </h3>
          </div>
          <span className="text-[10px] font-medium text-[#185FA5] bg-[#E6F1FB] px-2 py-0.5 rounded-full">
            Editable
          </span>
        </div>
        <div className="px-5 sm:px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IconField
              label="Institution"
              icon={<GraduationCap size={13} />}
              value={institution}
              onChange={set("institution")}
            />
            <IconField
              label="Programme"
              icon={<BookOpen size={13} />}
              value={programme}
              onChange={set("programme")}
            />
            <IconField
              label="Region"
              icon={<MapPin size={13} />}
              value={profile?.region ?? "—"}
              onChange={() => {}}
              readOnly
            />
            <IconField
              label="High School"
              icon={<GraduationCap size={13} />}
              value={highSchool}
              onChange={set("highSchool")}
            />
            <IconField
              label="Congregation"
              icon={<Church size={13} />}
              value={congregation}
              onChange={set("congregation")}
            />
            <IconField
              label="District Church"
              icon={<Church size={13} />}
              value={districtChurch}
              onChange={set("districtChurch")}
            />
          </div>
        </div>
      </div>

      {/* ── Sticky Save Bar ────────────────────────────────────────── */}
      <AnimatePresence>
        {hasEdits && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="sticky bottom-0 z-10"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-md px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-[13px] text-slate-600">Unsaved changes</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEdits({})}
                  className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={save}
                  disabled={updateProfile.isPending}
                  className="flex items-center gap-2 px-5 py-2 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                >
                  {updateProfile.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {updateProfile.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SheepProfile;
