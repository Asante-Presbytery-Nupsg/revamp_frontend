import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Spinner from "@/components/ui/Spinner";

const roleRedirect = {
  admin: "/dashboard/admin",
  shepherd: "/dashboard/shepherd",
  sheep: "/dashboard/sheep",
} as const;

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  const from = (location.state as { from: { pathname: string } })?.from
    ?.pathname;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={12} />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const defaultRedirect = roleRedirect[user.role];
    const safeTo = from?.startsWith(`/dashboard/${user.role}`)
      ? from
      : defaultRedirect;
    return <Navigate to={safeTo} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
