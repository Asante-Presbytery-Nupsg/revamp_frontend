import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  totalFiltered: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 1) return [0];
  const WINDOW = 1;
  const pages: (number | "...")[] = [];
  const start = Math.max(1, current - WINDOW);
  const end = Math.min(total - 2, current + WINDOW);
  pages.push(0);
  if (start > 1) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 2) pages.push("...");
  if (total > 1) pages.push(total - 1);
  return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageCount,
  pageSize,
  totalFiltered,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}) => {
  const [jumping, setJumping] = useState(false);
  const [jumpVal, setJumpVal] = useState(String(pageIndex + 1));

  const from = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalFiltered);
  const pages = buildPages(pageIndex, pageCount);
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;
  const progress = pageCount > 0 ? ((pageIndex + 1) / pageCount) * 100 : 0;

  const commitJump = () => {
    const n = parseInt(jumpVal);
    if (!isNaN(n) && n >= 1 && n <= pageCount) {
      onPageChange(n - 1);
    } else {
      setJumpVal(String(pageIndex + 1));
    }
    setJumping(false);
  };

  return (
    <div className="border-t border-slate-100">
      {/* ── Mobile ─────────────────────────────────────────────────── */}
      <div className="sm:hidden">
        {/* Progress bar */}
        <div className="h-0.75 bg-slate-100">
          <div
            className="h-full bg-[#0C447C] rounded-r-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3 gap-3">
          {/* Prev */}
          <button
            onClick={() => canPrev && onPageChange(pageIndex - 1)}
            disabled={!canPrev}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200
                       text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors shrink-0"
          >
            <ChevronLeft size={15} />
          </button>

          {/* Centre — tap to jump */}
          <button
            className="flex-1 text-center"
            onClick={() => {
              setJumpVal(String(pageIndex + 1));
              setJumping(true);
            }}
          >
            {jumping ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  autoFocus
                  type="number"
                  min={1}
                  max={pageCount}
                  value={jumpVal}
                  onChange={(e) => setJumpVal(e.target.value)}
                  onBlur={commitJump}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitJump();
                    if (e.key === "Escape") {
                      setJumping(false);
                      setJumpVal(String(pageIndex + 1));
                    }
                  }}
                  className="w-12 h-8 text-center text-[13px] font-medium border border-slate-300
                             rounded-lg bg-white focus:outline-none focus:border-[#185FA5]"
                />
                <span className="text-[12px] text-slate-400">
                  of {pageCount}
                </span>
              </div>
            ) : (
              <>
                <p className="text-[13px] font-medium text-slate-800 leading-tight">
                  Page {pageIndex + 1} of {pageCount}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {from}–{to} of {totalFiltered}
                </p>
              </>
            )}
          </button>

          {/* Next */}
          <button
            onClick={() => canNext && onPageChange(pageIndex + 1)}
            disabled={!canNext}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200
                       text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors shrink-0"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Desktop ─────────────────────────────────────────────────── */}
      <div className="hidden sm:flex items-center justify-between gap-3 px-5 py-3.5">
        {/* Results + page size */}
        <div className="flex items-center gap-2">
          <p className="text-[12px] text-slate-400">
            Results:{" "}
            <span className="font-medium text-slate-600">
              {from} - {to}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-600">{totalFiltered}</span>
          </p>
          {pageSizeOptions.length > 0 && (
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-[12px] border border-slate-200 rounded-lg px-2 py-1 bg-white
                         text-slate-600 focus:outline-none focus:border-[#185FA5] cursor-pointer"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200
                       text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-8 flex items-center justify-center text-[12px] text-slate-400 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium transition-colors ${
                  p === pageIndex
                    ? "bg-[#0C447C] text-white"
                    : "text-slate-500 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {(p as number) + 1}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200
                       text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
