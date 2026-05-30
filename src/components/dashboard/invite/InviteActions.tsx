/* eslint-disable react-hooks/refs */
"use no memo";

import { useState } from "react";
import { Copy, RefreshCw, Trash2, MoreHorizontal } from "lucide-react";
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
import type { Invite } from "@/api/invites.api";

// ─── Component ────────────────────────────────────────────────────────────────

export const InviteActions: React.FC<{
  invite: Invite;
  onCopyLink: () => void;
  onRevoke: () => void;
  onDelete: () => void;
  onResend: () => void;
}> = ({ invite, onCopyLink, onRevoke, onDelete, onResend }) => {
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

  const actions =
    invite.status === "pending"
      ? [
          {
            icon: <Copy size={13} />,
            label: "Copy invite link",
            onClick: onCopyLink,
            danger: false,
          },
          {
            icon: <RefreshCw size={13} />,
            label: "Resend email",
            onClick: onResend,
            danger: false,
          },
          null,
          {
            icon: <Trash2 size={13} />,
            label: "Revoke invite",
            onClick: onRevoke,
            danger: true,
          },
        ]
      : [
          {
            icon: <Trash2 size={13} />,
            label: "Delete",
            onClick: onDelete,
            danger: true,
          },
        ];

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${
          open
            ? "bg-[#E6F1FB] text-[#185FA5]"
            : "text-slate-300 hover:bg-slate-100 hover:text-slate-600"
        }`}
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 bg-white border border-slate-200 rounded-md shadow-sm py-1.5 min-w-44"
          >
            {actions.map((item, i) =>
              item === null ? (
                <div key={i} className="h-px bg-slate-100 my-1.5 mx-2" />
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
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

export default InviteActions;
