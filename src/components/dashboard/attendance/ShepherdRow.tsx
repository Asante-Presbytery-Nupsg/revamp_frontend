import type { SessionRecord, ShepherdGroup } from "@/types/shepherd.types";
import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";

interface SheepSummary {
  sheepId: string;
  sheep: string;
  institution: string | null;
  present: number;
  absent: number;
  total: number;
  rate: number;
  lastSeen: string | Date | null;
}

const aggregateBySheep = (sessions: SessionRecord[]): SheepSummary[] => {
  const map = new Map<string, SheepSummary>();

  for (const s of sessions) {
    const existing = map.get(s.sheepId);
    if (existing) {
      if (s.status === "present") existing.present++;
      else existing.absent++;
      existing.total++;
      if (
        !existing.lastSeen ||
        new Date(s.date) > new Date(existing.lastSeen)
      ) {
        existing.lastSeen = s.date;
      }
    } else {
      map.set(s.sheepId, {
        sheepId: s.sheepId,
        sheep: s.sheep,
        institution: s.institution,
        present: s.status === "present" ? 1 : 0,
        absent: s.status === "absent" ? 1 : 0,
        total: 1,
        rate: 0,
        lastSeen: s.date,
      });
    }
  }

  return Array.from(map.values())
    .map((s) => ({
      ...s,
      rate: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate);
};

const getShepherdStats = (sessions: SessionRecord[]) => {
  const present = sessions.filter((s) => s.status === "present").length;
  const total = sessions.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;
  return { present, absent: total - present, total, rate };
};

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ShepherdRow: React.FC<{
  group: ShepherdGroup;
  search: string;
}> = ({ group, search }) => {
  const [open, setOpen] = useState(false);
  const stats = getShepherdStats(group.sessions);

  const sheepSummaries = useMemo(
    () => aggregateBySheep(group.sessions),
    [group.sessions],
  );

  const filtered = search
    ? sheepSummaries.filter((s) => {
        const q = search.toLowerCase();
        return (
          s.sheep.toLowerCase().includes(q) ||
          (s.institution ?? "").toLowerCase().includes(q)
        );
      })
    : sheepSummaries;

  if (search && filtered.length === 0) return null;

  const initials = group.shepherd
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="border-b border-slate-200 last:border-0">
      {/* Shepherd header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-[#E6F1FB] flex items-center justify-center shrink-0">
          <span className="text-[11px] font-semibold text-[#185FA5]">
            {initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-slate-900">
            {group.shepherd}
          </p>
          <p className="text-[11px] text-slate-400">
            {sheepSummaries.length} members · {stats.total} sessions recorded
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={11} /> {stats.present}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
            <XCircle size={11} /> {stats.absent}
          </span>

          <div className="flex items-center gap-2 ml-2">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#185FA5] rounded-full"
                style={{ width: `${stats.rate}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-[#185FA5] w-8 text-right">
              {stats.rate}%
            </span>
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-slate-400"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Expanded — members with their aggregate stats */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50/60 border-t border-slate-200 max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10">
                  <tr className="border-b border-slate-100">
                    {[
                      "Member",
                      "Institution",
                      "Present",
                      "Absent",
                      "Rate",
                      "Last Seen",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.sheepId}
                      className="border-b border-slate-100 last:border-0 hover:bg-white/60 transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-semibold text-slate-400">
                              {s.sheep
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="text-[13px] font-medium text-slate-900">
                            {s.sheep}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <span
                          className={`text-[12px] ${s.institution ? "text-slate-500" : "text-slate-300 italic"}`}
                        >
                          {s.institution || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-green-700">
                          <CheckCircle2 size={11} /> {s.present}
                        </span>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-500">
                          <XCircle size={11} /> {s.absent}
                        </span>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.rate >= 75
                                  ? "bg-green-500"
                                  : s.rate >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${s.rate}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 w-8 text-right">
                            {s.rate}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[12px] text-slate-500">
                          {s.lastSeen ? formatDate(s.lastSeen) : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShepherdRow;
