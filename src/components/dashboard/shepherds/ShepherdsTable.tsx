import React from "react";
import { Search, X } from "lucide-react";
import type { Shepherd, DrawerContent } from "./types";
import ShepherdRow from "./ShepherdRow";
import { Pagination } from "@/components/shared/Pagination";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface Props {
  shepherds: Shepherd[];
  isLoading?: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDrawer: (c: DrawerContent) => void;
  // pagination
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const ShepherdsTable: React.FC<Props> = ({
  shepherds,
  isLoading,
  search,
  onSearchChange,
  onDeactivate,
  onDelete,
  onOpenDrawer,
  pageIndex,
  pageCount,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
    {/* Toolbar */}
    <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-slate-100">
      <div className="relative flex-1 max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search shepherd or sheep..."
          className="w-full pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-colors placeholder:text-slate-400"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={12} />
          </button>
        )}
      </div>
      <p className="text-[12px] text-slate-400 hidden sm:block shrink-0">
        {totalItems} shepherds
      </p>
    </div>

    {/* Rows */}
    {isLoading ? (
      <div className="px-5 py-16 text-center">
        <p className="text-[13px] font-light text-slate-400">
          Loading shepherds…
        </p>
      </div>
    ) : shepherds.length === 0 ? (
      <div className="px-5 py-16 text-center">
        <p className="text-[13px] font-light text-slate-400">
          {search ? "No shepherds found." : "No shepherds yet."}
        </p>
      </div>
    ) : (
      shepherds.map((s) => (
        <ShepherdRow
          key={s.id}
          shepherd={s}
          search={search}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
          onOpenDrawer={onOpenDrawer}
        />
      ))
    )}

    {/* Pagination */}
    {totalItems > 0 && (
      <Pagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        totalFiltered={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    )}
  </div>
);

export default ShepherdsTable;
