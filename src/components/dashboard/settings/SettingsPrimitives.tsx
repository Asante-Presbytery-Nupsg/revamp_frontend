import { motion } from "framer-motion";
import { Save, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

// ─── Shared class strings ─────────────────────────────────────────────────────

export const inputCls =
  "w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-colors placeholder:text-slate-300";

export const labelCls =
  "block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5";

// ─── Field ────────────────────────────────────────────────────────────────────

export const Field: React.FC<{
  label: string;
  children: ReactNode;
  hint?: string;
}> = ({ label, children, hint }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
    {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

export const Section: React.FC<{
  title: string;
  desc?: string;
  children: ReactNode;
  onSave?: () => void;
  saving?: boolean;
}> = ({ title, desc, children, onSave, saving }) => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
    <div className="px-6 py-5 border-b border-slate-100">
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      {desc && <p className="text-[12px] text-slate-400 mt-0.5">{desc}</p>}
    </div>
    <div className="px-6 py-5 space-y-5">{children}</div>
    {onSave && (
      <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            >
              <Save size={14} />
            </motion.div>
          ) : (
            <Save size={14} />
          )}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    )}
  </div>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-10 h-6 rounded-full relative transition-colors duration-200 shrink-0 ${
      checked ? "bg-[#0C447C]" : "bg-slate-200"
    }`}
  >
    <motion.div
      animate={{ x: checked ? 18 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
    />
  </button>
);

// ─── SelectField ──────────────────────────────────────────────────────────────

export const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}> = ({ label, value, onChange, options, hint }) => (
  <Field label={label} hint={hint}>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-8`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  </Field>
);
