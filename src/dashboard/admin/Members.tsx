"use no memo";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  X,
  Download,
  UserPlus,
  UserCheck,
  Trash2,
} from "lucide-react";
import { ColumnToggle } from "@/components/dashboard/members/ColumnToggle";
import { Pagination } from "@/components/shared/Pagination";
import { useMemberColumns } from "@/hooks/useMemberColumns";
import {
  useMembers,
  useApproveMember,
  useDeleteMember,
} from "@/hooks/queries/useMembers";
import { useDebounce } from "@/hooks/useDebounce";

// ─── Sort icon ────────────────────────────────────────────────────────────────

const SortIcon = ({ sorted }: { sorted: false | "asc" | "desc" }) => {
  if (sorted === "asc")
    return <ChevronUp size={12} className="text-[#185FA5] shrink-0" />;
  if (sorted === "desc")
    return <ChevronDown size={12} className="text-[#185FA5] shrink-0" />;
  return <ChevronsUpDown size={12} className="text-slate-300 shrink-0" />;
};

// ─── Status tabs ──────────────────────────────────────────────────────────────

const STATUS_TABS = ["All", "active", "inactive"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

// ─── Page ─────────────────────────────────────────────────────────────────────

const MembersPage: React.FC = () => {
  "use no memo";

  const [statusTab, setStatusTab] = useState<StatusTab>("All");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    guardian: false,
    guardianContact: false,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const debouncedSearch = useDebounce(search, 400);

  // ── Server query ──────────────────────────────────────────────────────────
  const { data, isFetching } = useMembers({
    search: debouncedSearch || undefined,
    status:
      statusTab === "active"
        ? "active"
        : statusTab === "inactive"
          ? "inactive"
          : undefined,
    page: pageIndex + 1,
    limit: pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });
  const members = useMemo(() => data?.data ?? [], [data]);
  const totalCount = data?.pagination.total ?? 0;
  const pageCount = data?.pagination.totalPages ?? 1;

  const { mutate: approveMember } = useApproveMember();
  const { mutate: deleteMember } = useDeleteMember();

  const COLUMNS = useMemberColumns();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: members,
    columns: COLUMNS,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPageIndex(0);
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableSorting: true,
  });

  const selectedIds = useMemo(
    () =>
      Object.keys(rowSelection)
        .filter((k) => rowSelection[k])
        .map((k) => members[Number(k)]?.id)
        .filter(Boolean),
    [rowSelection, members],
  );
  const selectedCount = selectedIds.length;
  const clearSelection = () => setRowSelection({});

  const handleTabChange = (tab: StatusTab) => {
    setStatusTab(tab);
    setPageIndex(0);
    clearSelection();
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteMember(id));
    clearSelection();
  };

  const handleBulkApprove = () => {
    selectedIds.forEach((id) => approveMember(id));
    clearSelection();
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight leading-tight">
            Members
          </h1>
          <p className="text-[13px] tracking-wide text-slate-400 mt-0.5 font-medium">
            {isFetching ? "Loading..." : `${totalCount} total registrations`}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5]
                     text-white text-[13px] font-medium rounded-lg transition-colors shrink-0"
        >
          <UserPlus size={15} />
          <span className="hidden sm:block">Add Member</span>
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize ${
              statusTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100 min-h-16">
          {selectedCount > 0 ? (
            <div className="flex items-center gap-3 w-full">
              <span className="text-[13px] font-semibold text-slate-900">
                {selectedCount} selected
              </span>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <button
                  onClick={clearSelection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                             text-slate-600 border border-slate-200 hover:bg-gray-50 transition-colors"
                >
                  <X size={12} /> Clear
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                             text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Download size={12} /> Export
                </button>
                <button
                  onClick={handleBulkApprove}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                             text-[#185FA5] border border-[#185FA5]/30 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <UserCheck size={12} /> Approve
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                             text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative flex-1 max-w-xs">
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
                  placeholder="Search members..."
                  className="w-full pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-lg bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                             transition-colors placeholder:text-slate-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-600
                             border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download size={14} />
                  <span className="hidden sm:block">Export</span>
                </button>
                <ColumnToggle table={table} />
              </div>
            </>
          )}
        </div>

        {/* Table */}
        <div
          className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
        >
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-100 bg-white">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-400 whitespace-nowrap"
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-1.5 ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-slate-600" : ""}`}
                          onClick={() => {
                            if (!header.column.getCanSort()) return;
                            const current = header.column.getIsSorted();
                            if (!current) header.column.toggleSorting(false);
                            else if (current === "asc")
                              header.column.toggleSorting(true);
                            else header.column.clearSorting();
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <SortIcon sorted={header.column.getIsSorted()} />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {members.length === 0 && !isFetching ? (
                <tr>
                  <td
                    colSpan={table.getAllLeafColumns().length}
                    className="px-4 py-20 text-center"
                  >
                    <p className="text-[13px] font-light text-slate-400">
                      No members found.
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-50 last:border-0 transition-colors cursor-default ${
                      row.getIsSelected()
                        ? "bg-gray-100/80"
                        : "hover:bg-gray-50/80"
                    }`}
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

        {/* Pagination */}
        <Pagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          totalFiltered={totalCount}
          onPageChange={(p) => setPageIndex(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPageIndex(0);
          }}
        />
      </div>
    </div>
  );
};

export default MembersPage;
