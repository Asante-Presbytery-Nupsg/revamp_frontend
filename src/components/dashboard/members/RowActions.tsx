/* eslint-disable react-hooks/refs */
import { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import {
  MoreVertical,
  Eye,
  Mail,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";
import type { Member } from "@/api/members.api";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const RowActions: React.FC<{ member: Member }> = ({ member: _ }) => {
  "use no memo";
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  const ITEMS = [
    { icon: <Eye size={13} />, label: "View profile", danger: false },
    { icon: <Mail size={13} />, label: "Send message", danger: false },
    { icon: <UserCheck size={13} />, label: "Assign shepherd", danger: false },
    null,
    { icon: <UserX size={13} />, label: "Deactivate", danger: true },
    { icon: <Trash2 size={13} />, label: "Delete", danger: true },
  ] as const;

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
          open
            ? "bg-[#E6F1FB] text-[#185FA5]"
            : "text-slate-300 hover:bg-slate-100 hover:text-slate-600"
        }`}
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 bg-white border border-slate-200 rounded-lg shadow-sm py-1.5 min-w-45"
          >
            {ITEMS.map((item, i) =>
              item === null ? (
                <div key={i} className="h-px bg-slate-100 my-1.5 mx-2" />
              ) : (
                <button
                  key={item.label}
                  onClick={() => setOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors text-left ${
                    item.danger
                      ? "text-red-500 hover:bg-red-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={item.danger ? "text-red-400" : "text-slate-400"}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ),
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default RowActions;
