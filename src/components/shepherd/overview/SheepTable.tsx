/* eslint-disable react-hooks/incompatible-library */
"use no memo";

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone, GraduationCap } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import type { ShepherdSheepRow } from "@/api/shepherdOverview.api";

const ini = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

const rateColor = (r: number) =>
  r >= 80 ? "text-green-600" : r >= 60 ? "text-amber-600" : "text-red-500";

const rateBar = (r: number) =>
  r >= 80 ? "bg-green-500" : r >= 60 ? "bg-amber-400" : "bg-red-400";

const col = createColumnHelper<ShepherdSheepRow>();

const COLUMNS = [
  col.accessor("name", {
    header: "Member",
    cell: (info) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#E6F1FB] flex items-center justify-center text-[10px] font-bold text-[#185FA5] shrink-0">
          {ini(info.getValue())}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-900 truncate">
            {info.getValue()}
          </p>
          {info.row.original.phone && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Phone size={9} />
              <span>{info.row.original.phone}</span>
            </div>
          )}
        </div>
      </div>
    ),
  }),
  col.accessor("programme", {
    header: "Programme",
    cell: (info) => (
      <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
        <GraduationCap size={11} className="text-slate-400 shrink-0" />
        <span className="truncate">{info.getValue() ?? "—"}</span>
      </div>
    ),
  }),
  col.accessor("attendanceRate", {
    header: "Attendance",
    cell: (info) => {
      const r = info.getValue();
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${rateBar(r)}`}
              style={{ width: `${r}%` }}
            />
          </div>
          <span className={`text-[11px] font-bold ${rateColor(r)}`}>{r}%</span>
        </div>
      );
    },
  }),
  col.accessor("lastSeen", {
    header: "Last Seen",
    cell: (info) => (
      <span className="text-[11px] text-slate-400">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),
  col.accessor("status", {
    header: "Status",
    cell: (info) => (
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${info.getValue() === "active" ? "bg-green-500" : "bg-slate-300"}`}
        />
        <span
          className={`text-[11px] font-medium capitalize ${info.getValue() === "active" ? "text-green-600" : "text-slate-400"}`}
        >
          {info.getValue()}
        </span>
      </div>
    ),
  }),
];

export const SheepTable: React.FC<{ data: ShepherdSheepRow[] }> = ({
  data,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns: COLUMNS,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-[14px] font-semibold text-slate-900">My Sheep</h3>
        <button
          onClick={() => navigate("/dashboard/shepherd/sheep")}
          className="flex items-center gap-1 text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2"
        >
          See all <ArrowRight size={13} />
        </button>
      </div>

      {data.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-[13px] text-slate-400 font-light">
            No sheep assigned yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-150">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-100">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={() =>
                        header.column.getCanSort() &&
                        header.column.toggleSorting()
                      }
                      className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap ${
                        header.column.getCanSort()
                          ? "cursor-pointer select-none hover:text-slate-600"
                          : ""
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SheepTable;
