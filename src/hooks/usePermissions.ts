import { useAuthStore } from "@/store/useAuthStore";
import type { Permission } from "@/lib/permissions";

export const usePermissions = () => {
  const user = useAuthStore((s) => s.user);
  const permissions = user?.permissions ?? [];

  return {
    can: (permission: Permission) => permissions.includes(permission),
    canAll: (perms: Permission[]) =>
      perms.every((p) => permissions.includes(p)),
    canAny: (perms: Permission[]) => perms.some((p) => permissions.includes(p)),
    role: user?.role,
  };
};
