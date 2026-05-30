"use no memo";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  Download,
  Search,
  X,
} from "lucide-react";
import {
  useAttendanceGrouped,
  useAttendanceStats,
} from "@/hooks/queries/useAttendance";
import { useDebounce } from "@/hooks/useDebounce";
import ShepherdRow from "@/components/dashboard/attendance/ShepherdRow";
import { StatCard } from "@/components/dashboard/attendance/StatCard";
import { Pagination } from "@/components/shared/Pagination";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const AdminAttendance: React.FC = () => {
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearch = useDebounce(search, 400);

  // ── Data ──────────────────────────────────────────────────────────
  const { data: groupedResponse, isLoading: loadingGroups } =
    useAttendanceGrouped({
      search: debouncedSearch || undefined,
      page: pageIndex + 1,
      limit: pageSize,
    });
  const { data: statsData, isLoading: loadingStats } = useAttendanceStats();

  const groups = groupedResponse?.data ?? [];
  const totalItems = groupedResponse?.pagination.total ?? 0;
  const pageCount = groupedResponse?.pagination.totalPages ?? 0;

  // ── Stats ─────────────────────────────────────────────────────────
  const totalSessions = statsData?.total ?? 0;
  const totalPresent = statsData?.present ?? 0;
  const overallRate = statsData?.rate ?? 0;

  const STATS = [
    {
      label: "Total Sessions",
      value: loadingStats ? "—" : totalSessions,
      icon: <Users size={16} />,
      color: "text-[#0C447C]",
      bg: "bg-[#E6F1FB]",
    },
    {
      label: "Present",
      value: loadingStats ? "—" : totalPresent,
      icon: <CheckCircle2 size={16} />,
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      label: "Absent",
      value: loadingStats ? "—" : totalSessions - totalPresent,
      icon: <XCircle size={16} />,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Overall Rate",
      value: loadingStats ? "—" : `${overallRate}%`,
      icon: <TrendingUp size={16} />,
      color: "text-[#0C447C]",
      bg: "bg-[#E6F1FB]",
    },
  ];

  const handleSearch = (v: string) => {
    setSearch(v);
    setPageIndex(0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight leading-tight">
          Shepherd Attendance
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Check-in sessions grouped by shepherd
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search shepherd, member, institution..."
              className="w-full sm:w-72 pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-lg bg-white
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
          <button className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={14} />
            <span className="hidden sm:block">Export</span>
          </button>
        </div>

        {/* Shepherd groups */}
        <div>
          {loadingGroups ? (
            <div className="px-5 py-16 text-center">
              <p className="text-[13px] font-light text-slate-400">
                Loading attendance records…
              </p>
            </div>
          ) : groups.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-[13px] font-light text-slate-400">
                {debouncedSearch
                  ? "No results found."
                  : "No attendance records yet."}
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <ShepherdRow key={group.shepherdId} group={group} search="" />
            ))
          )}
        </div>

        {/* Pagination */}
        {pageCount >= 1 && totalItems > 0 && (
          <Pagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            totalFiltered={totalItems}
            onPageChange={setPageIndex}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
