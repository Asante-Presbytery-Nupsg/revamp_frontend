"use no memo";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Star,
  MessageSquare,
  CheckCircle2,
  Lock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  useAllFeedback,
  useFeedbackStats,
  useUpdateFeedback,
  useDeleteFeedback,
} from "@/hooks/queries/useFeedback";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/shared/Pagination";
import type {
  FeedbackItem,
  FeedbackCategory,
  FeedbackStatus,
} from "@/api/feedback.api";
import { CategoryChart } from "@/components/dashboard/feedback/CategoryChart";
import StatCard from "@/components/dashboard/feedback/StatCard";
import DetailDrawer from "@/components/dashboard/feedback/DetailDrawer";
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  STATUS_CONFIG,
  STATUS_OPTIONS,
} from "@/components/dashboard/feedback/feedback.config";
import StatusRing from "@/components/dashboard/feedback/StatusRing";
import FeedbackMobileCard from "@/components/dashboard/feedback/FeedbackMobileCard";
import { formatDate } from "@/lib/utils";

// ─── Filter Pill ──────────────────────────────────────────────────────────────

const FilterPill: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}> = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all whitespace-nowrap ${
      active
        ? "bg-[#0C447C] text-white shadow-sm"
        : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
    }`}
  >
    {label}
    {count !== undefined && count > 0 && (
      <span
        className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// ─── Table Columns ────────────────────────────────────────────────────────────

const col = createColumnHelper<FeedbackItem>();

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminFeedback: React.FC = () => {
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<
    FeedbackCategory | "all"
  >("all");
  const [selected, setSelected] = useState<FeedbackItem | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const query = {
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    page: pageIndex + 1,
    limit: pageSize,
  };

  const { data: response, isLoading } = useAllFeedback(query);
  const { data: stats } = useFeedbackStats();
  const updateFeedback = useUpdateFeedback();
  const deleteFeedback = useDeleteFeedback();

  const items = response?.data ?? [];
  const totalItems = response?.pagination.total ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPageIndex(0);
  };

  const handleStatusChange = (id: string, status: FeedbackStatus) => {
    updateFeedback.mutate(
      { id, input: { status } },
      { onSuccess: () => setSelected(null) },
    );
  };

  const handleNoteChange = (id: string, adminNote: string) => {
    updateFeedback.mutate({ id, input: { adminNote } });
  };

  const handleDelete = (id: string) => {
    deleteFeedback.mutate(id, { onSuccess: () => setSelected(null) });
  };

  const columns = useMemo(
    () => [
      col.accessor("submitterName", {
        header: "From",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-2.5 font-semibold">
              {row.anonymous ? (
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                  <Lock size={10} className="text-slate-400" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center">
                  <span className="text-[9px] font-bold text-[#185FA5]">
                    {(info.getValue() ?? "?")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
              <span className="text-[13px] text-slate-700">
                {row.anonymous ? (
                  <span className="italic text-slate-400">Anonymous</span>
                ) : (
                  (info.getValue() ?? "—")
                )}
              </span>
            </div>
          );
        },
      }),
      col.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-[10px] font-semibold text-[#185FA5] bg-[#E6F1FB] px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[info.getValue()]}
          </span>
        ),
      }),
      col.accessor("rating", {
        header: "Rating",
        cell: (info) => (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                className={
                  s <= info.getValue()
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200 fill-slate-200"
                }
              />
            ))}
          </div>
        ),
      }),
      col.accessor("message", {
        header: "Message",
        cell: (info) => (
          <p className="text-[12px] text-slate-500 max-w-55 truncate">
            {info.getValue()}
          </p>
        ),
      }),
      col.accessor("status", {
        header: "Status",
        cell: (info) => {
          const s = STATUS_CONFIG[info.getValue()];
          return (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}
            >
              {s.icon} {s.label}
            </span>
          );
        },
      }),
      col.accessor("createdAt", {
        header: "Date",
        cell: (info) => (
          <span className="text-[11px] text-slate-400">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] sm:text-[28px] tracking-tight leading-tight">
          Feedback
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Review and manage member feedback
        </p>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 min-[384px]:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total submitted"
          value={stats?.total ?? 0}
          icon={<MessageSquare size={14} />}
          color="text-[#0C447C]"
          bg="bg-[#E6F1FB]"
        />
        <StatCard
          label="Avg rating"
          value={stats?.avgRating ? `${stats.avgRating} ★` : "—"}
          icon={<Star size={14} />}
          color="text-amber-600"
          bg="bg-amber-50"
          accent="bg-amber-400"
        />
        <StatCard
          label="Pending review"
          value={stats?.byStatus?.received ?? 0}
          icon={<MessageSquare size={14} />}
          color="text-slate-600"
          bg="bg-slate-100"
        />
        <StatCard
          label="Actioned"
          value={stats?.byStatus?.actioned ?? 0}
          icon={<CheckCircle2 size={14} />}
          color="text-green-700"
          bg="bg-green-50"
          accent="bg-green-400"
        />
      </div>

      {/* ── Charts Belt ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category distribution */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-[#185FA5]" />
            <h3 className="text-[14px] font-semibold text-slate-900">
              By Category
            </h3>
          </div>
          <CategoryChart data={stats?.byCategory} />
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900 mb-4">
              Status Breakdown
            </h3>

            <div className="space-y-4">
              {STATUS_OPTIONS.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const count = stats?.byStatus?.[s] ?? 0;
                const pct =
                  stats?.total && stats.total > 0
                    ? Math.round((count / stats.total) * 100)
                    : 0;
                return (
                  <div key={s}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[12px] font-medium ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[12px] font-semibold text-slate-700">
                        {count}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          s === "received"
                            ? "bg-slate-400"
                            : s === "reviewed"
                              ? "bg-[#185FA5]"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <StatusRing byStatus={stats?.byStatus} total={stats?.total ?? 0} />
          </div>
        </div>
      </div>

      {/* ── Filters + Table ────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search feedback..."
                className="w-full pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                           transition-colors placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <FilterPill
                label="All"
                active={statusFilter === "all"}
                onClick={() => {
                  setStatusFilter("all");
                  setPageIndex(0);
                }}
                count={stats?.total}
              />
              {STATUS_OPTIONS.map((s) => (
                <FilterPill
                  key={s}
                  label={STATUS_CONFIG[s].label}
                  active={statusFilter === s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPageIndex(0);
                  }}
                  count={stats?.byStatus?.[s]}
                />
              ))}
            </div>
          </div>

          {/* Category pills — horizontal scroll on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <FilterPill
              label="All categories"
              active={categoryFilter === "all"}
              onClick={() => {
                setCategoryFilter("all");
                setPageIndex(0);
              }}
            />
            {CATEGORY_OPTIONS.map((c) => (
              <FilterPill
                key={c}
                label={CATEGORY_LABELS[c]}
                active={categoryFilter === c}
                onClick={() => {
                  setCategoryFilter(c);
                  setPageIndex(0);
                }}
              />
            ))}
          </div>
        </div>

        {/* Content — desktop table / mobile cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="text-slate-300 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={28} className="text-slate-200 mx-auto mb-3" />
            <p className="text-[14px] text-slate-400 font-light">
              {debouncedSearch ||
              statusFilter !== "all" ||
              categoryFilter !== "all"
                ? "No feedback matching your filters"
                : "No feedback received yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr
                      key={hg.id}
                      className="border-b border-slate-100 bg-slate-50/50"
                    >
                      {hg.headers.map((h) => (
                        <th
                          key={h.id}
                          className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-400 whitespace-nowrap"
                        >
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext(),
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
                      onClick={() => setSelected(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-5 py-3.5 whitespace-nowrap"
                        >
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

            {/* Mobile card list */}
            <div className="sm:hidden px-4 py-3 space-y-3">
              {items.map((item) => (
                <FeedbackMobileCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelected(item)}
                />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            totalFiltered={totalItems}
            onPageChange={setPageIndex}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPageIndex(0);
            }}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <DetailDrawer
            item={selected}
            onClose={() => setSelected(null)}
            onUpdateStatus={handleStatusChange}
            onUpdateNote={handleNoteChange}
            onDelete={handleDelete}
            updating={updateFeedback.isPending}
            deleting={deleteFeedback.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFeedback;
