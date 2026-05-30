import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Field, Section, inputCls } from "./SettingsPrimitives";
import {
  useSessions, useCreateSession, useActivateSession,
  useArchiveAndStart, useDeleteSession,
} from "@/hooks/queries/useSettings";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GH", { month: "short", year: "numeric" });

export const SessionTab: React.FC = () => {
  const { data: sessions = [], isLoading } = useSessions();
  const createSession   = useCreateSession();
  const activateSession = useActivateSession();
  const archiveAndStart = useArchiveAndStart();
  const deleteSession   = useDeleteSession();

  const [showArchive, setShowArchive] = useState(false);
  const [newName, setNewName]         = useState("");
  const [newForm, setNewForm]         = useState({ name: "", startDate: "", endDate: "" });

  const active   = sessions.find((s) => s.isActive);
  const past     = sessions.filter((s) => !s.isActive);

  const handleArchive = async () => {
    if (!newName.trim()) return;
    await archiveAndStart.mutateAsync(newName.trim());
    setNewName("");
    setShowArchive(false);
  };

  const handleCreate = async () => {
    if (!newForm.name || !newForm.startDate || !newForm.endDate) return;
    await createSession.mutateAsync(newForm);
    setNewForm({ name: "", startDate: "", endDate: "" });
  };

  if (isLoading) return <div className="flex items-center justify-center py-16"><Loader2 size={20} className="text-slate-300 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Current session */}
      <Section title="Current Session" desc="All attendance and events are logged against this session">
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#E6F1FB] rounded-xl">
              <div>
                <p className="text-[14px] font-semibold text-[#0C447C]">{active.name}</p>
                <p className="text-[11px] text-[#185FA5] mt-0.5">{fmt(active.startDate)} – {fmt(active.endDate)}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Active</span>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-slate-400">No active session. Create one below.</p>
        )}
      </Section>

      {/* Archive & start new */}
      {active && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-slate-900">Archive & start new session</p>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                Closes <span className="font-medium text-slate-600">{active.name}</span> for reporting — no new
                attendance or events can be logged against it. Members and shepherds carry over automatically.
              </p>
            </div>
            <button onClick={() => setShowArchive((o) => !o)}
              className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 text-[12px] font-semibold hover:bg-amber-50 transition-colors shrink-0">
              Archive
            </button>
          </div>
          <AnimatePresence>
            {showArchive && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                  <Field label="New session label" hint="This will become the active session after archiving">
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. 2027-2028" className={inputCls} />
                  </Field>
                  <div className="flex gap-3">
                    <button onClick={() => setShowArchive(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleArchive} disabled={!newName.trim() || archiveAndStart.isPending}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold transition-colors disabled:opacity-40">
                      {archiveAndStart.isPending ? "Archiving…" : `Archive ${active.name} → Start ${newName || "…"}`}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Create new session */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
        <p className="text-[14px] font-semibold text-slate-900">Create session</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Name">
            <input value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} placeholder="2026/2027" className={inputCls} />
          </Field>
          <Field label="Start date">
            <input type="date" value={newForm.startDate} onChange={(e) => setNewForm((f) => ({ ...f, startDate: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="End date">
            <input type="date" value={newForm.endDate} onChange={(e) => setNewForm((f) => ({ ...f, endDate: e.target.value }))} className={inputCls} />
          </Field>
        </div>
        <button onClick={handleCreate} disabled={!newForm.name || !newForm.startDate || !newForm.endDate || createSession.isPending}
          className="px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors disabled:opacity-40">
          {createSession.isPending ? "Creating…" : "Create session"}
        </button>
      </div>

      {/* Past sessions */}
      <Section title="Past Sessions">
        {past.length === 0 ? (
          <p className="text-[13px] text-slate-400">No archived sessions yet.</p>
        ) : (
          <div>
            {past.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">{s.name}</p>
                  <p className="text-[11px] text-slate-400">{fmt(s.startDate)} – {fmt(s.endDate)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => activateSession.mutate(s.id)} disabled={activateSession.isPending}
                    className="text-[11px] font-semibold text-[#185FA5] hover:underline underline-offset-2 disabled:opacity-40">
                    Restore
                  </button>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">Archived</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default SessionTab;
