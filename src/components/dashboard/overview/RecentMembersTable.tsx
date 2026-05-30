import React, { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import Card from "./Card";
import { getMembers } from "@/api/members.api";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

type Row = {
  id: string;
  name: string;
  institution: string;
  programme: string;
  region: string;
  shepherd: string;
  status: "active" | "inactive";
  date: string;
};

const colHelper = createColumnHelper<Row>();

const columns = [
  colHelper.accessor("name", {
    header: "Member",
    cell: (info) => {
      const initials = info
        .getValue()
        .split(" ")
        .map((n) => n[0])
        .join("");
      return (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
          <div className="w-8 h-8 rounded-full border border-slate-400 bg-[#E6F1FB] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-[#185FA5]">
              {initials}
            </span>
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-900 whitespace-nowrap">
              {info.getValue()}
            </p>
            <p
              className="text-[11px] text-slate-400 whitespace-nowrap max-w-40 truncate"
              title={info.row.original.institution}
            >
              {info.row.original.institution}
            </p>
          </div>
        </div>
      );
    },
  }),
  colHelper.accessor("programme", {
    header: "Programme",
    cell: (info) => (
      <span className="text-[12px] text-slate-600 whitespace-nowrap">
        {info.getValue() || "—"}
      </span>
    ),
  }),
  colHelper.accessor("region", {
    header: "Region",
    cell: (info) => (
      <span className="text-[12px] text-slate-600 whitespace-nowrap">
        {info.getValue() || "—"}
      </span>
    ),
  }),
  colHelper.accessor("shepherd", {
    header: "Shepherd",
    cell: (info) => (
      <span
        className={`text-[12px] whitespace-nowrap ${
          info.getValue() === "Unassigned" ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  colHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <div
        className={`flex justify-center py-1 w-fit px-4 rounded-full items-center gap-1.5 whitespace-nowrap ${info.getValue() === "active" ? "bg-green-50" : "text-amber-600"}`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            info.getValue() === "active" ? "bg-green-500" : "bg-amber-400"
          }`}
        />
        <span
          className={`text-[12px] font-medium ${
            info.getValue() === "active" ? "text-green-600" : "text-amber-600"
          }`}
        >
          {info.getValue()}
        </span>
      </div>
    ),
  }),
  colHelper.accessor("date", {
    header: "Joined",
    cell: (info) => (
      <span className="text-[12px] text-slate-400 whitespace-nowrap">
        {info.getValue()}
      </span>
    ),
  }),
];

const RecentMembersTable: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isFetching } = useQuery({
    queryKey: ["members", "recent-overview"],
    queryFn: () => getMembers({ page: 1, limit: 8 }),
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const rows: Row[] = useMemo(() => {
    return (data?.data ?? []).map((m) => ({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      institution: m.institution ?? "—",
      programme: m.programme ?? "—",
      region: m.region ?? "—",
      shepherd: m.shepherdId ? "Assigned" : "Unassigned",
      status: m.isActive ? "active" : "inactive",
      date: new Date(m.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));
  }, [data]);

  const memoColumns = useMemo(() => columns, []);
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">
            Recent Members
          </h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Latest registrations across all campuses
          </p>
        </div>
        <Link
          to="/dashboard/admin/members"
          className="text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2 flex items-center gap-1 shrink-0"
        >
          View all <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="relative isolate overflow-hidden">
        <div
          className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
        >
          <table className="w-full min-w-170">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-50">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-5 py-3 text-left text-[10px] font-medium tracking-[0.08em] uppercase text-slate-400 whitespace-nowrap"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.length === 0 && !isFetching ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-10 text-center text-[13px] text-slate-400"
                  >
                    No members yet.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default RecentMembersTable;
