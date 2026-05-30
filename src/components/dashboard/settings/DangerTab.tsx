import { useState } from "react";
import { AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useDeactivateUnassigned } from "@/hooks/queries/useSettings";

const DangerRow: React.FC<{
  title: string;
  desc: string;
  label: string;
  onConfirm: () => Promise<void>;
  loading: boolean;
}> = ({ title, desc, label, onConfirm, loading }) => {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const handle = async () => {
    await onConfirm();
    setConfirming(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-slate-900">{title}</p>
        <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">
          {desc}
        </p>
        {done && (
          <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle2 size={11} /> Done
          </p>
        )}
      </div>

      {confirming ? (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setConfirming(false)}
            className="px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            {loading ? "Running…" : "Confirm"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 text-[12px] font-semibold hover:bg-amber-50 transition-colors shrink-0"
        >
          {label}
        </button>
      )}
    </div>
  );
};

export const DangerTab: React.FC = () => {
  const deactivate = useDeactivateUnassigned();

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[12px] text-amber-800 leading-relaxed">
          Actions here have significant or irreversible effects. A confirmation
          step is required for each.
        </p>
      </div>

      <DangerRow
        title="Reset attendance records"
        desc="Delete all attendance sessions for the current academic year. Members and shepherds are not affected."
        label="Reset"
        loading={false}
        onConfirm={async () => {
          window.alert("Connect this to your attendance reset endpoint.");
        }}
      />
      <DangerRow
        title="Deactivate unassigned members"
        desc="Sets all sheep with no shepherd assigned to inactive. They will no longer appear in active member lists."
        label="Run"
        loading={deactivate.isPending}
        onConfirm={async () => {
          await deactivate.mutateAsync();
        }}
      />
      <DangerRow
        title="Archive current session"
        desc="Close the current academic year and move all data to archive. A new session can then be started."
        label="Archive"
        loading={false}
        onConfirm={async () => {
          window.location.hash = "session";
        }}
      />
    </div>
  );
};

export default DangerTab;
