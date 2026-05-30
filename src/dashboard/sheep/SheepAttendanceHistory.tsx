"use no memo";

import { useState } from "react";
import { TrendingUp, Search, X } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMyAttendanceHistory } from "@/hooks/queries/useAttendance";
import { useDebounce } from "@/hooks/useDebounce";
import { useAttendanceColumns } from "@/components/sheep/attendance/useAttendanceColumns";
import { Pagination } from "@/components/shared/Pagination";
import Spinner from "@/components/ui/Spinner";

const SheepAttendanceHistory: React.FC = () => {
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearch = useDebounce(search, 400);

  const { data: response, isLoading } = useMyAttendanceHistory({
    page: pageIndex + 1,
    limit: pageSize,
  });

  const rawData = response?.data ?? [];
  const stats = response?.stats;
  const totalFiltered = response?.total ?? 0;
  const pageCount = Math.ceil(totalFiltered / pageSize);

  // Client-side search through the fetched page (optional — backend doesn't search notes yet)
  const data = debouncedSearch
    ? rawData.filter((r) => {
        const q = debouncedSearch.toLowerCase();
        return (
          r.markedBy.toLowerCase().includes(q) ||
          (r.notes ?? "").toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
        );
      })
    : rawData;

  const columns = useAttendanceColumns();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner size={12} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight leading-tight">
          Attendance History
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Your check-in record with your shepherd
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Sessions",
            value: stats?.total ?? 0,
            color: "text-[#0C447C]",
          },
          {
            label: "Present",
            value: stats?.present ?? 0,
            color: "text-green-600",
          },
          {
            label: "Attendance Rate",
            value: `${stats?.rate ?? 0}%`,
            color: "text-[#0C447C]",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-100 p-4 text-center"
          >
            <p
              className={`font-serif text-[32px] font-light leading-none tracking-tight ${color}`}
            >
              {value}
            </p>
            <p className="text-[11px] font-medium text-slate-400 mt-1.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Rate bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-[#185FA5]" />
            <span className="text-[13px] font-semibold text-slate-900">
              Overall attendance rate
            </span>
          </div>
          <span className="text-[13px] font-semibold text-[#185FA5]">
            {stats?.rate ?? 0}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#185FA5] rounded-full transition-all duration-700"
            style={{ width: `${stats?.rate ?? 0}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {stats?.present ?? 0} present out of {stats?.total ?? 0} sessions
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="relative max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageIndex(0);
              }}
              placeholder="Search sessions..."
              className="w-full pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-lg bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                         transition-colors placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPageIndex(0);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-100 bg-white">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-400 whitespace-nowrap"
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center"
                  >
                    <p className="text-[13px] font-light text-slate-400">
                      {debouncedSearch
                        ? "No sessions found for that search."
                        : "No attendance records yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3.5 whitespace-nowrap"
                      >
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

        {totalFiltered > 0 && (
          <Pagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            totalFiltered={totalFiltered}
            onPageChange={setPageIndex}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPageIndex(0);
            }}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>
    </div>
  );
};

export default SheepAttendanceHistory;
