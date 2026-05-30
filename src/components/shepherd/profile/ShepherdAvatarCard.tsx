import { Camera } from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────

export const ShepherdAvatarCard: React.FC<{
  firstName: string;
  lastName: string;
  position: string;
  institution: string;
}> = ({ firstName, lastName, position, institution }) => {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="relative shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0C447C] flex items-center justify-center">
            <span className="text-[20px] sm:text-[22px] font-bold text-white">
              {initials}
            </span>
          </div>
          <button
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#185FA5] text-white
                             flex items-center justify-center hover:bg-[#0C447C] transition-colors shadow-sm"
          >
            <Camera size={11} />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] sm:text-[18px] font-semibold text-slate-900 truncate">
            {firstName} {lastName}
          </p>
          <p className="text-[12px] sm:text-[13px] text-slate-400 mt-0.5">
            {position} · {institution}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px] font-medium text-green-600">
              Active shepherd
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShepherdAvatarCard;
