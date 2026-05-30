/* eslint-disable react-hooks/refs */
import { useState } from "react";
import { Settings2 } from "lucide-react";
import { useReactTable } from "@tanstack/react-table";
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
import type { Member } from "@/api/members.api";

// ─── Component ────────────────────────────────────────────────────────────────

export const ColumnToggle: React.FC<{
  table: ReturnType<typeof useReactTable<Member>>;
}> = ({ table }) => {
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
    useDismiss(context, { referencePress: false }),
  ]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`flex items-center gap-2 px-3 py-2 text-[13px] font-medium border rounded-lg transition-colors ${
          open
            ? "bg-slate-100 border-slate-300 text-slate-700"
            : "text-slate-600 border-slate-200 hover:bg-slate-50"
        }`}
      >
        <Settings2 size={14} />
        <span className="hidden sm:block">Columns</span>
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 bg-white border border-slate-200 rounded-lg shadow-sm p-3 min-w-44"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Toggle columns
            </p>
            {table
              .getAllLeafColumns()
              .filter((col) => col.id !== "select" && col.id !== "actions")
              .map((col) => (
                <label
                  key={col.id}
                  className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={(e) => col.toggleVisibility(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#185FA5]"
                  />
                  <span className="text-[12px] font-medium text-slate-700 capitalize">
                    {typeof col.columnDef.header === "string"
                      ? col.columnDef.header
                      : col.id}
                  </span>
                </label>
              ))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default ColumnToggle;
