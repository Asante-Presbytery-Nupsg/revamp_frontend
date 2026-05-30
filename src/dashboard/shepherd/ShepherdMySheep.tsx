"use no memo";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, X, Users, CalendarCheck, Loader2 } from "lucide-react";
import { SheepDrawer } from "@/components/shepherd/mysheep/SheepDrawer";
import { SheepCard } from "@/components/shepherd/mysheep/SheepCard";
import { type Sheep } from "@/components/shepherd/mysheep/sheepData";
import { useMySheep } from "@/hooks/queries/useShepherds";
import type { MySheep } from "@/api/shepherd.api";

const adaptSheep = (s: MySheep): Sheep => ({
  id: s.id,
  name: [s.firstName, s.lastName].filter(Boolean).join(" ") || "—",
  email: s.email,
  phone: s.phoneNumber ?? "—",
  institution: s.institution ?? "—",
  programme: s.programme ?? "—",
  level: "—",
  hostel: s.residence ?? "—",
  region: "—",
  attendanceRate: s.attendanceRate ?? 0,
  sessionCount: s.sessionCount ?? 0,
  lastSeen: s.lastSeen ?? "—",
  status: s.isActive ? "active" : "inactive",
});

type StatConfig = {
  label: string;
  value: string | number;
  color: string;
};

const ShepherdMySheep: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Sheep | null>(null);

  const { data, isLoading } = useMySheep({ limit: 100 });

  const raw = useMemo<MySheep[]>(() => data?.data ?? [], [data]);
  const sheep = useMemo<Sheep[]>(() => raw.map(adaptSheep), [raw]);

  const total = data?.pagination.total ?? sheep.length;

  const needsAttention = useMemo<Sheep[]>(
    () => sheep.filter((s) => s.attendanceRate < 70 && s.sessionCount > 0),
    [sheep],
  );

  const avgRate = sheep.length
    ? Math.round(
        sheep.reduce((acc, s) => acc + s.attendanceRate, 0) / sheep.length,
      )
    : 0;

  const filtered = useMemo<Sheep[]>(
    () =>
      !search
        ? sheep
        : sheep.filter(
            (s) =>
              s.name.toLowerCase().includes(search.toLowerCase()) ||
              s.programme.toLowerCase().includes(search.toLowerCase()) ||
              s.institution.toLowerCase().includes(search.toLowerCase()),
          ),
    [sheep, search],
  );

  const stats = useMemo<StatConfig[]>(
    () => [
      {
        label: "Total sheep",
        value: isLoading ? "—" : total,
        color: "text-[#0C447C]",
      },
      {
        label: "Avg attendance",
        value: isLoading ? "—" : `${avgRate}%`,
        color: "text-green-600",
      },
      {
        label: "Needs attention",
        value: isLoading ? "—" : needsAttention.length,
        color: needsAttention.length > 0 ? "text-amber-600" : "text-slate-400",
      },
    ],
    [isLoading, total, avgRate, needsAttention.length],
  );

  return (
    <>
      <AnimatePresence>
        {selected && (
          <SheepDrawer sheep={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight">
            My Sheep
          </h1>
          <p className="text-[13px] font-light text-slate-400 mt-0.5">
            Members assigned to you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-slate-200 p-5 text-center"
            >
              <p
                className={`font-serif text-[28px] font-light leading-none ${color}`}
              >
                {value}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1.5">
                {label}
              </p>
            </div>
          ))}
        </div>

        {!isLoading && needsAttention.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Users size={14} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-amber-900">
                {needsAttention.length} member
                {needsAttention.length > 1 ? "s" : ""} need
                {needsAttention.length === 1 ? "s" : ""} attention
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                {needsAttention.map((s) => s.name.split(" ")[0]).join(", ")}{" "}
                {needsAttention.length === 1 ? "has" : "have"} attendance below
                70%
              </p>
            </div>
          </div>
        )}

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name, programme..."
            className="w-full pl-8 pr-8 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                       transition-colors placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-slate-100">
              <Loader2 size={20} className="text-slate-300 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center bg-white rounded-xl border border-slate-100">
              <p className="text-[13px] font-light text-slate-400">
                {search ? "No members found." : "No sheep assigned yet."}
              </p>
            </div>
          ) : (
            filtered.map((s: Sheep) => (
              <SheepCard key={s.id} sheep={s} onClick={() => setSelected(s)} />
            ))
          )}
        </div>

        {!isLoading && sheep.length > 0 && (
          <div className="bg-[#0C447C] rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-white">
                Ready to take attendance?
              </p>
              <p className="text-[12px] text-white/60 mt-0.5">
                Mark your sheep for today's check-in
              </p>
            </div>
            <a
              href="/dashboard/shepherd/attendance"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0C447C] text-[12px] font-bold rounded-xl hover:bg-slate-50 transition-colors shrink-0"
            >
              <CalendarCheck size={14} /> Take Attendance
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default ShepherdMySheep;
