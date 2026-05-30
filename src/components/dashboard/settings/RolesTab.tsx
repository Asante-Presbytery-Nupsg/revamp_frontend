import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, X, ChevronDown, Loader2 } from "lucide-react";
import { Section, inputCls } from "./SettingsPrimitives";
import {
  useAdmins,
  useRemoveAdmin,
  useInviteAdmin,
  useRoleSummary,
} from "@/hooks/queries/useSettings";
import { useAuthStore } from "@/store/useAuthStore";
import type { AdminUser } from "@/api/settings.api";

const PERMISSIONS = [
  ["View members & shepherds", true, true],
  ["Manage events", true, true],
  ["Approve shepherds", true, true],
  ["Export reports", true, true],
  ["Manage org settings", false, true],
  ["Invite/remove admins", false, true],
  ["Delete org data", false, true],
] as const;

export const RolesTab: React.FC = () => {
  const { data: admins = [], isLoading } = useAdmins();
  const { data: summary } = useRoleSummary();
  const removeAdmin = useRemoveAdmin();
  const inviteAdmin = useInviteAdmin();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Admin");

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    await inviteAdmin.mutateAsync({
      email: inviteEmail.trim(),
      role: inviteRole,
    });
    setShowInvite(false);
    setInviteEmail("");
  };

  const ini = (a: AdminUser) =>
    `${a.firstName[0] ?? ""}${a.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <Section
        title="Administrators"
        desc="Manage who has admin access to this organisation"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={18} className="text-slate-300 animate-spin" />
          </div>
        ) : (
          <div className="space-y-0">
            {admins.map((a) => {
              const isYou = a.id === currentUserId;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 py-3.5 border-b border-slate-50 last:border-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E6F1FB] flex items-center justify-center text-[11px] font-bold text-[#185FA5] shrink-0">
                    {ini(a)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-slate-900 truncate">
                        {a.firstName} {a.lastName}
                      </p>
                      {isYou && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#185FA5] bg-[#E6F1FB] px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {a.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5] shrink-0">
                    Admin
                  </span>
                  {!isYou && (
                    <button
                      onClick={() => removeAdmin.mutate(a.id)}
                      disabled={removeAdmin.isPending}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setShowInvite((o) => !o)}
          className="flex items-center gap-2 text-[13px] font-medium text-[#185FA5] hover:underline underline-offset-2 mt-2"
        >
          <Plus size={14} /> Invite administrator
        </button>

        <AnimatePresence>
          {showInvite && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-3 pt-2 flex-col sm:flex-row">
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className={`${inputCls} flex-1`}
                />
                <div className="relative w-full sm:w-36 shrink-0">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className={`${inputCls} appearance-none pr-7`}
                  >
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || inviteAdmin.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium rounded-xl transition-colors shrink-0 disabled:opacity-40"
                >
                  {inviteAdmin.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {inviteAdmin.isPending ? "Sending…" : "Send invite"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="text-[13px] font-semibold text-slate-900 mb-3">
          Role permissions
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-100 text-[12px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-2 text-left font-semibold text-slate-500">
                  Permission
                </th>
                <th className="py-2 text-center font-semibold text-slate-500">
                  Admin
                </th>
                <th className="py-2 text-center font-semibold text-slate-500">
                  Super Admin
                </th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(([perm, admin, superAdmin]) => (
                <tr
                  key={perm}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-2.5 text-slate-700">{perm}</td>
                  <td className="py-2.5 text-center">
                    {admin ? (
                      <Check size={13} className="text-green-500 mx-auto" />
                    ) : (
                      <X size={13} className="text-slate-200 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 text-center">
                    {superAdmin ? (
                      <Check size={13} className="text-green-500 mx-auto" />
                    ) : (
                      <X size={13} className="text-slate-200 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {summary && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-[11px] text-slate-400">
            <span>
              {summary.admin} admin{summary.admin !== 1 ? "s" : ""}
            </span>
            <span>·</span>
            <span>
              {summary.shepherd} shepherd{summary.shepherd !== 1 ? "s" : ""}
            </span>
            <span>·</span>
            <span>
              {summary.sheep} member{summary.sheep !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesTab;
