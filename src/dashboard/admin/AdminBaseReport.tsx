"use no memo";

import { useState, useMemo } from "react";
import {
  Download,
  Users,
  Church,
  Activity,
  HandHeart,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  useUnionAttendance,
  useUnionAttendanceStats,
  useCreateUnionAttendance,
} from "@/hooks/queries/useUnionAttendance";
import {
  usePrayerRequests,
  usePrayerStats,
} from "@/hooks/queries/usePrayerRequests";
import { useMinistries, useMinistryStats } from "@/hooks/queries/useMinistries";
import type {
  UnionAttendance,
  MeetingType,
  Period,
} from "@/api/unionAttendance.api";
import type { PrayerRequest } from "@/api/prayerRequests.api";
import AttendanceChart from "@/components/dashboard/attendance/AttendanceChart";
import Pagination from "@/components/shared/Pagination";

type Tab = "overview" | "attendance" | "ministries" | "prayer";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Activity size={14} /> },
  { id: "attendance", label: "Attendance", icon: <Users size={14} /> },
  { id: "ministries", label: "Ministry Status", icon: <Church size={14} /> },
  { id: "prayer", label: "Prayer Requests", icon: <HandHeart size={14} /> },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly", label: "Yearly" },
];

const MEETING_BADGES: Record<MeetingType, string> = {
  "Sunday Service": "bg-blue-50 text-blue-700",
  "Mid-week": "bg-purple-50 text-purple-700",
  "Bible Study": "bg-emerald-50 text-emerald-700",
  "Special Program": "bg-amber-50 text-amber-700",
};

const PAGE_SIZE = 15;

const PeriodToggle = ({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) => (
  <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
    {PERIODS.map((p) => (
      <button
        key={p.id}
        onClick={() => onChange(p.id)}
        className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
          value === p.id
            ? "bg-white text-[#0C447C] shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        {p.label}
      </button>
    ))}
  </div>
);

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  tone?: "default" | "warning" | "danger" | "success";
}

const StatCard = ({ label, value, trend, tone = "default" }: StatCardProps) => {
  const toneStyles = {
    default: "text-[#0C447C]",
    warning: "text-amber-600",
    danger: "text-red-600",
    success: "text-emerald-600",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4">
      <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`font-serif font-light text-[22px] sm:text-[28px] leading-tight mt-2 ${toneStyles[tone]}`}
      >
        {value}
      </p>
      {trend && (
        <p className="text-[11px] text-slate-400 mt-1 font-light">{trend}</p>
      )}
    </div>
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
  });

// ─── Modal ────────────────────────────────────────────────────────────────────

const RecordAttendanceModal = ({
  open,
  onClose,
  onSave,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    date: string;
    meeting: MeetingType;
    male: number;
    female: number;
  }) => void;
  saving: boolean;
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [meeting, setMeeting] = useState<MeetingType>("Sunday Service");
  const [male, setMale] = useState("");
  const [female, setFemale] = useState("");

  if (!open) return null;

  const total = (parseInt(male) || 0) + (parseInt(female) || 0);

  return (
    <div className="fixed backdrop-blur-sm inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="font-serif font-light text-[20px] text-slate-800">
              Record Attendance
            </h3>
            <p className="text-[12px] text-slate-400 font-light mt-0.5">
              Log a meeting's attendance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C447C]/20 focus:border-[#0C447C]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
              Meeting
            </label>
            <select
              value={meeting}
              onChange={(e) => setMeeting(e.target.value as MeetingType)}
              className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C447C]/20 focus:border-[#0C447C]"
            >
              <option>Sunday Service</option>
              <option>Mid-week</option>
              <option>Bible Study</option>
              <option>Special Program</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                Male
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={male}
                onChange={(e) => setMale(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C447C]/20 focus:border-[#0C447C]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                Female
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={female}
                onChange={(e) => setFemale(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C447C]/20 focus:border-[#0C447C]"
              />
            </div>
          </div>

          {total > 0 && (
            <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
              <span className="text-[12px] text-slate-500 font-medium">
                Total
              </span>
              <span className="font-serif text-[20px] text-[#0C447C]">
                {total}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-5 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                date,
                meeting,
                male: parseInt(male) || 0,
                female: parseInt(female) || 0,
              })
            }
            disabled={!male || !female || saving}
            className="flex-1 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Tables ───────────────────────────────────────────────────────────────────

const attendanceColumnHelper = createColumnHelper<UnionAttendance>();
const prayerColumnHelper = createColumnHelper<PrayerRequest>();

// ─── AttendanceTable ──────────────────────────────────────────────────────────

export const AttendanceTable = ({ data }: { data: UnionAttendance[] }) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const columns = useMemo(
    () => [
      attendanceColumnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-slate-700 font-light whitespace-nowrap">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      attendanceColumnHelper.accessor("meeting", {
        header: "Meeting",
        cell: (info) => {
          const v = info.getValue();
          return (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${MEETING_BADGES[v]}`}
            >
              {v}
            </span>
          );
        },
      }),
      attendanceColumnHelper.accessor("male", {
        header: "Male",
        cell: (info) => (
          <span className="text-slate-700 font-light">{info.getValue()}</span>
        ),
      }),
      attendanceColumnHelper.accessor("female", {
        header: "Female",
        cell: (info) => (
          <span className="text-slate-700 font-light">{info.getValue()}</span>
        ),
      }),
      attendanceColumnHelper.display({
        id: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="text-slate-800 font-medium">
            {row.original.male + row.original.female}
          </span>
        ),
      }),
    ],
    [],
  );

  // Sort first, then slice for current page
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPageIndex(0); // reset to first page on sort
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // we handle slicing ourselves
  });

  const sortedRows = table.getRowModel().rows;
  const pageCount = Math.ceil(sortedRows.length / pageSize);
  const paged = sortedRows.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize,
  );

  if (data.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[14px] text-slate-500 font-light">
          No attendance records for this period
        </p>
        <p className="text-[12px] text-slate-400 font-light mt-1">
          Click "Record Attendance" to add the first one
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-[13px] min-w-140">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-slate-200 text-left">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="pb-2 px-5 sm:px-0 first:pl-5 sm:first:pl-0 font-medium text-slate-500 text-[11px] uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" && "↑"}
                      {h.column.getIsSorted() === "desc" && "↓"}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-3 px-5 sm:px-0 first:pl-5 sm:first:pl-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <Pagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          totalFiltered={data.length}
          onPageChange={setPageIndex}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPageIndex(0);
          }}
          pageSizeOptions={[10, 20, 50]}
        />
      )}
    </>
  );
};

export const PrayerTable = ({ data }: { data: PrayerRequest[] }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const columns = useMemo(
    () => [
      prayerColumnHelper.accessor("submittedByName", {
        header: "Submitted By",
        cell: (info) => (
          <span className="text-slate-700 font-light">
            {info.getValue() ?? "—"}
          </span>
        ),
      }),
      prayerColumnHelper.accessor("title", {
        header: "Request",
        cell: (info) => (
          <span className="text-slate-700 font-light">{info.getValue()}</span>
        ),
      }),
      prayerColumnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-slate-600 font-light">{info.getValue()}</span>
        ),
      }),
      prayerColumnHelper.accessor("priority", {
        header: "Priority",
        cell: (info) => {
          const v = info.getValue();
          return (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${v === "Urgent" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}
            >
              {v}
            </span>
          );
        },
      }),
      prayerColumnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const v = info.getValue();
          return (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${v === "Open" ? "bg-amber-50 text-amber-700" : v === "In Progress" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}
            >
              {v}
            </span>
          );
        },
      }),
      prayerColumnHelper.accessor("createdAt", {
        header: "Date",
        cell: (info) => (
          <span className="text-slate-500 font-mono text-[12px]">
            {shortDate(info.getValue())}
          </span>
        ),
      }),
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const pageCount = Math.ceil(data.length / pageSize);
  const paged = table
    .getRowModel()
    .rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  if (data.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[14px] text-slate-500 font-light">
          No prayer requests
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-[13px] min-w-175">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-slate-200 text-left">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="pb-2 px-5 sm:px-0 first:pl-5 sm:first:pl-0 font-medium text-slate-500 text-[11px] uppercase tracking-wide"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-3 px-5 sm:px-0 first:pl-5 sm:first:pl-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <Pagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          totalFiltered={data.length}
          onPageChange={setPageIndex}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPageIndex(0);
          }}
          pageSizeOptions={[10, 20, 50]}
        />
      )}
    </>
  );
};

// ─── Tab Content ──────────────────────────────────────────────────────────────

const OverviewReport = ({
  period,
  attendanceRecords,
  loadingAttendance,
}: {
  period: Period;
  attendanceRecords: UnionAttendance[];
  loadingAttendance: boolean;
}) => {
  const { data: attendanceStats, isLoading: loadingStats } =
    useUnionAttendanceStats(period);
  const { data: prayerStats, isLoading: loadingPrayer } = usePrayerStats();
  const { data: ministryStats, isLoading: loadingMinistry } =
    useMinistryStats();

  const periodLabel =
    period === "monthly"
      ? "month"
      : period === "quarterly"
        ? "quarter"
        : "year";

  const stats: StatCardProps[] = [
    {
      label: "Avg Attendance",
      value: loadingStats ? "—" : (attendanceStats?.avgAttendance ?? 0),
      trend: loadingStats
        ? ""
        : `Across ${attendanceStats?.meetingCount ?? 0} meetings this ${periodLabel}`,
      tone: "success",
    },
    {
      label: "Total Attendance",
      value: loadingStats
        ? "—"
        : (attendanceStats?.totalAttendance ?? 0).toLocaleString(),
      trend: `This ${periodLabel}`,
      tone: "default",
    },
    {
      label: "Open Prayer Requests",
      value: loadingPrayer ? "—" : (prayerStats?.open ?? 0),
      trend: loadingPrayer ? "" : `${prayerStats?.urgent ?? 0} marked urgent`,
      tone: "warning",
    },
    {
      label: "Active Ministries",
      value: loadingMinistry ? "—" : (ministryStats?.active ?? 0),
      trend: loadingMinistry ? "" : `of ${ministryStats?.total ?? 0} total`,
      tone: "success",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <AttendanceChart
        data={attendanceRecords}
        loading={loadingAttendance}
        period={period}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-medium text-slate-800">
              Leader's Brief
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Latest snapshot</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Current
          </span>
        </div>
        <p className="text-[13px] text-slate-600 font-light leading-relaxed">
          {attendanceStats && attendanceStats.meetingCount > 0
            ? `${attendanceStats.meetingCount} meetings this ${periodLabel} with an average of ${attendanceStats.avgAttendance} in attendance. `
            : ""}
          {prayerStats && prayerStats.urgent > 0
            ? `${prayerStats.urgent} urgent prayer request${prayerStats.urgent > 1 ? "s" : ""} need attention. `
            : ""}
          {ministryStats && ministryStats.planning > 0
            ? `${ministryStats.planning} ministries currently in planning phase.`
            : "All ministries operational."}
        </p>
      </div>
    </div>
  );
};

const MinistriesReport = () => {
  const { data, isLoading } = useMinistries({ limit: 50 });
  const ministries = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="text-slate-300 animate-spin" />
      </div>
    );
  }

  if (ministries.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <p className="text-[14px] text-slate-500 font-light">
          No ministries yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ministries.map((m) => (
        <div
          key={m.id}
          className="bg-white border border-slate-200 rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-2 gap-2">
            <h4 className="text-[14px] font-medium text-slate-800">{m.name}</h4>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${m.status === "Active" ? "bg-emerald-50 text-emerald-700" : m.status === "Planning" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
            >
              {m.status}
            </span>
          </div>
          {m.leadName && (
            <p className="text-[12px] text-slate-500 font-light">
              Lead: {m.leadName}
            </p>
          )}
          {m.note && (
            <p className="text-[13px] text-slate-600 font-light mt-2">
              {m.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminBaseReport: React.FC = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const [period, setPeriod] = useState<Period>("monthly");
  const [recordOpen, setRecordOpen] = useState(false);

  const days = period === "monthly" ? 30 : period === "quarterly" ? 90 : 365;
  const from = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
  }, [days]);

  const { data: attendanceData, isLoading: loadingAttendance } =
    useUnionAttendance({ from, limit: 500 });
  const attendanceRecords = attendanceData?.data ?? [];

  const { data: prayerData, isLoading: loadingPrayer } = usePrayerRequests({
    limit: 500,
  });
  const prayerRecords = prayerData?.data ?? [];

  const createAttendance = useCreateUnionAttendance();

  const handleSaveAttendance = (data: {
    date: string;
    meeting: MeetingType;
    male: number;
    female: number;
  }) => {
    createAttendance.mutate(data, { onSuccess: () => setRecordOpen(false) });
  };

  const showPeriodToggle = tab === "overview" || tab === "attendance";

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif font-light text-[#0c0d0e] text-[22px] sm:text-[28px] tracking-tight leading-tight">
            Situational Report
          </h1>
          <p className="text-[12px] sm:text-[13px] font-light text-slate-400 mt-0.5">
            Snapshot of what needs attention right now
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors shrink-0">
          <Download size={15} />
          <span className="hidden sm:block">Export</span>
        </button>
      </div>

      <div
        className="overflow-x-auto border-b border-slate-200"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex min-w-max">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all ${
                tab === t.id
                  ? "border-[#0C447C] text-[#0C447C]"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showPeriodToggle && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PeriodToggle value={period} onChange={setPeriod} />
          {tab === "attendance" && (
            <button
              onClick={() => setRecordOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-[#0C447C] hover:text-[#0C447C] text-slate-600 text-[12px] font-medium rounded-lg transition-colors"
            >
              <Plus size={14} />
              <span>Record Attendance</span>
            </button>
          )}
        </div>
      )}

      {tab === "overview" && (
        <OverviewReport
          period={period}
          attendanceRecords={attendanceRecords}
          loadingAttendance={loadingAttendance}
        />
      )}

      {tab === "attendance" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-baseline justify-between mb-4 gap-3">
            <h3 className="text-[15px] font-medium text-slate-800">
              Meeting Records
            </h3>
            <span className="text-[12px] text-slate-400 font-light">
              {attendanceRecords.length}{" "}
              {attendanceRecords.length === 1 ? "meeting" : "meetings"}
            </span>
          </div>
          {loadingAttendance ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="text-slate-300 animate-spin" />
            </div>
          ) : (
            <AttendanceTable data={attendanceRecords} />
          )}
        </div>
      )}

      {tab === "ministries" && <MinistriesReport />}

      {tab === "prayer" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-[15px] font-medium text-slate-800 mb-4">
            Prayer Requests
          </h3>
          {loadingPrayer ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="text-slate-300 animate-spin" />
            </div>
          ) : (
            <PrayerTable data={prayerRecords} />
          )}
        </div>
      )}

      <RecordAttendanceModal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        onSave={handleSaveAttendance}
        saving={createAttendance.isPending}
      />
    </div>
  );
};

export default AdminBaseReport;
