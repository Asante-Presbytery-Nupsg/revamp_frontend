import React from "react";
import {
  Loader2,
  User,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import ModalShell from "./ModalShell";
import { useMyProfile } from "@/hooks/queries/useSheepProfile";
import type { ShepherdSnippet } from "@/api/sheepProfile.api";

const MyShepherdModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: profile, isLoading } = useMyProfile();
  const shepherd: ShepherdSnippet | null = profile?.shepherd ?? null;

  const ini = (s: ShepherdSnippet) =>
    `${s.firstName[0] ?? ""}${s.lastName[0] ?? ""}`.toUpperCase();

  return (
    <ModalShell
      title="My Shepherd"
      subtitle="Assigned pastoral oversight"
      onClose={onClose}
      footer={
        shepherd && (shepherd.phone || shepherd.email) ? (
          <div className="flex gap-3 w-full">
            {shepherd.phone && (
              <a
                href={`tel:${shepherd.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                           border border-slate-200 text-[13px] font-bold text-slate-700
                           hover:bg-slate-50 transition-colors"
              >
                <Phone size={14} />
                Call
              </a>
            )}
            {shepherd.email && (
              <a
                href={`mailto:${shepherd.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0C447C]
                           hover:bg-[#185FA5] text-white text-[13px] font-bold rounded-xl
                           transition-colors"
              >
                <Mail size={14} />
                Email
              </a>
            )}
          </div>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : !shepherd ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <User size={24} className="text-slate-200" />
          </div>
          <p className="text-[14px] text-slate-900 font-semibold">
            No shepherd assigned
          </p>
          <p className="text-[12px] text-slate-400 mt-1 max-w-55">
            Please contact your administrator to be assigned to a shepherd.
          </p>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Header Block: Solid & Clean */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div
              className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center
                          text-[18px] font-bold text-[#0C447C] shrink-0 shadow-sm"
            >
              {ini(shepherd)}
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900 leading-tight">
                {shepherd.firstName} {shepherd.lastName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {shepherd.position ?? "Active Shepherd"}
                </p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">
              Background Information
            </p>

            <div className="divide-y divide-slate-50 border-t border-b border-slate-100">
              <div className="flex items-center justify-between py-3 px-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <GraduationCap size={14} />
                  <span className="text-[12px]">Institution</span>
                </div>
                <span className="text-[13px] font-medium text-slate-900">
                  {shepherd.institution || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 px-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Briefcase size={14} />
                  <span className="text-[12px]">Programme</span>
                </div>
                <span className="text-[13px] font-medium text-slate-900">
                  {shepherd.programme || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Welfare Info Nudge: Matches NoticeCard Style */}
          <div className="flex items-start gap-3 p-4 bg-[#E6F1FB] rounded-2xl border border-[#185FA5]/10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
              <ChevronRight size={14} className="text-[#185FA5]" />
            </div>
            <p className="text-[12px] text-[#185FA5] leading-relaxed font-medium">
              Your shepherd is available for spiritual counseling and welfare
              support. Don't hesitate to reach out.
            </p>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default MyShepherdModal;
