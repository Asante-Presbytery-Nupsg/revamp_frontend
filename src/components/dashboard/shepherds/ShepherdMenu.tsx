import React, { useState } from "react";
import { MoreHorizontal, Shield, Trash2 } from "lucide-react";
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
import type { Shepherd } from "./types";

const ShepherdMenu: React.FC<{
  shepherd: Shepherd;
  onDeactivate: () => void;
  onDelete: () => void;
}> = ({ shepherd, onDeactivate, onDelete }) => {
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

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors shrink-0 ${
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
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 bg-white border border-slate-200 rounded-lg shadow-sm shadow-gray-100 py-1.5 min-w-45"
          >
            <button
              onClick={() => {
                onDeactivate();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 hover:bg-slate-50 text-left"
            >
              <Shield size={13} className="text-slate-400" />
              {shepherd.isActive === true ? "Deactivate" : "Reactivate"}
            </button>
            <div className="h-px bg-slate-100 my-1.5 mx-2" />
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 text-left"
            >
              <Trash2 size={13} className="text-red-400" /> Remove
            </button>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default ShepherdMenu;
