// PermissionGate.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { Permission, Role } from "@/lib/permissions";

interface Props {
  children: React.ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  anyPermissions?: Permission[];
}

const PermissionGate: React.FC<Props> = ({
  children,
  roles,
  permissions,
  anyPermissions,
}) => {
  const user = useAuthStore((s) => s.user)!;

  const userPermissions = user.permissions ?? [];
  const role = user.role as Role;

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permissions && !permissions.every((p) => userPermissions.includes(p))) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    anyPermissions &&
    !anyPermissions.some((p) => userPermissions.includes(p))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PermissionGate;
