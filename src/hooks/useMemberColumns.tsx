import {
  createColumnHelper,
  type Row,
  type Table,
} from "@tanstack/react-table";
import { StatusBadge } from "@/components/dashboard/members/StatusBadge";
import { RowActions } from "@/components/dashboard/members/RowActions";
import type { Member } from "@/api/members.api";

const col = createColumnHelper<Member>();

export const useMemberColumns = () => [
  {
    id: "select",
    size: 44,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }: { table: Table<Member> }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        ref={(el) => {
          if (el) el.indeterminate = table.getIsSomePageRowsSelected();
        }}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        className="w-3.5 h-3.5 accent-[#185FA5] cursor-pointer"
      />
    ),
    cell: ({ row }: { row: Row<Member> }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        className="w-3.5 h-3.5 accent-[#185FA5] cursor-pointer disabled:opacity-30"
      />
    ),
  },

  col.accessor("firstName", {
    id: "member",
    header: "Member",
    cell: (info) => {
      const { firstName, lastName, phoneNumber } = info.row.original;
      const fullName = `${firstName} ${lastName}`;
      const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 border border-slate-400 rounded-full bg-[#E6F1FB] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-[#185FA5]">
              {initials}
            </span>
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-900">{fullName}</p>
            <p className="text-[11px] text-slate-400">{phoneNumber}</p>
          </div>
        </div>
      );
    },
  }),

  col.accessor("institution", {
    header: "Institution",
    cell: (info) => (
      <span
        className="text-[13px] text-slate-500 font-medium block truncate max-w-40"
        title={info.getValue() ?? ""}
      >
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  col.accessor("programme", {
    header: "Programme",
    cell: (info) => (
      <span
        className="text-[13px] text-slate-500 font-medium block truncate max-w-37.5"
        title={info.getValue() ?? ""}
      >
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  col.accessor("congregation", {
    header: "Congregation",
    cell: (info) => (
      <span
        className="text-[13px] text-slate-500 font-medium block truncate max-w-40"
        title={info.getValue() ?? ""}
      >
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  col.accessor("shepherdId", {
    header: "Shepherd",
    cell: (info) => (
      <span
        className={`text-[13px] ${
          !info.getValue()
            ? "text-slate-300 italic"
            : "text-slate-500 font-medium"
        }`}
      >
        {info.getValue() ? "Assigned" : "Unassigned"}
      </span>
    ),
  }),

  col.accessor("isActive", {
    id: "status",
    header: "Status",
    cell: (info) => (
      <StatusBadge status={info.getValue() ? "active" : "inactive"} />
    ),
  }),

  col.accessor("guardianName", {
    id: "guardian",
    header: "Guardian",
    cell: (info) => (
      <span className="text-[13px] text-slate-500 font-medium">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  col.accessor("guardianContact", {
    id: "guardianContact",
    header: "Guardian Phone",
    cell: (info) => (
      <span className="text-[13px] text-slate-500 font-medium">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),

  col.accessor("createdAt", {
    header: "Joined",
    cell: (info) => (
      <span className="text-[12px] text-slate-400">
        {new Date(info.getValue()).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  }),

  {
    id: "actions",
    size: 48,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }: { row: Row<Member> }) => (
      <RowActions member={row.original} />
    ),
  },
];
