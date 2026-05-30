import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Spinner from "@/components/ui/Spinner";

// ── Layouts ───────────────────────────────────────────────────
import PublicLayout from "./components/layouts/PublicLayout";
import DashLayout from "./dashboard/layouts/DashLayout";
import GuestRoute from "./auth/Guards/GuestRoute";
import ProtectedRoute from "./auth/Guards/ProtectedRoute";
import PermissionGate from "./auth/Guards/PermissionGate";
import { useAuthStore } from "./store/useAuthStore";
import ScrollToTop from "./components/shared/ScrollToTop";
import AdminRegister from "./auth/Admin/Index";
import PlaceholderPage from "./dashboard/PlaceholderPage";

// ── Auth ──────────────────────────────────────────────────────
const Register = lazy(() => import("./auth/Register/index"));
const LoginPage = lazy(() => import("./auth/Login"));
const ShepherdRegister = lazy(() => import("./auth/Shepherd"));

// ── Public ────────────────────────────────────────────────────
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProgramsPage = lazy(() => import("./pages/Programs"));
const { NotFound, Unauthorized } = {
  NotFound: lazy(() =>
    import("./pages/ErrorPages").then((m) => ({ default: m.NotFound })),
  ),
  Unauthorized: lazy(() =>
    import("./pages/ErrorPages").then((m) => ({ default: m.Unauthorized })),
  ),
};

// ── Admin ─────────────────────────────────────────────────────
const AdminOverview = lazy(() => import("./dashboard/admin/Overview"));
const MembersPage = lazy(() => import("./dashboard/admin/Members"));
const AdminAttendance = lazy(() => import("./dashboard/admin/AdminAttendance"));
const AdminEvents = lazy(() => import("./dashboard/admin/Events"));
const AdminShepherds = lazy(() => import("./dashboard/admin/Shepherd"));
const RegionsPagesAdmin = lazy(
  () => import("./dashboard/admin/RegionsPagesAdmin"),
);
const AdminReports = lazy(() => import("./dashboard/admin/AdminReports"));
const AdminBaseReport = lazy(() => import("./dashboard/admin/AdminBaseReport"));
const InviteShepherds = lazy(() => import("./dashboard/admin/InviteShepherds"));
const AdminSettings = lazy(() => import("./dashboard/admin/AdminSettings"));
const AdminFeedback = lazy(() => import("./dashboard/admin/AdminFeedback"));

// ── Shepherd ──────────────────────────────────────────────────
const ShepherdOverview = lazy(
  () => import("./dashboard/shepherd/ShepherdOverview"),
);
const ShepherdMySheep = lazy(
  () => import("./dashboard/shepherd/ShepherdMySheep"),
);
const ShepherdAttendance = lazy(
  () => import("./dashboard/shepherd/ShepherdAttendance"),
);
const ShepherdEvents = lazy(
  () => import("./dashboard/shepherd/ShepherdEvents"),
);
const ShepherdProfile = lazy(
  () => import("./dashboard/shepherd/ShepherdProfile"),
);
const ShepherdFeedback = lazy(
  () => import("./dashboard/shepherd/ShepherdFeedback"),
);

// ── Sheep ─────────────────────────────────────────────────────
const SheepProfile = lazy(() => import("./dashboard/sheep/SheepProfile"));
const SheepAttendanceHistory = lazy(
  () => import("./dashboard/sheep/SheepAttendanceHistory"),
);
const SheepEvents = lazy(() => import("./dashboard/sheep/SheepEvents"));
const SubmitFeedback = lazy(() => import("./dashboard/sheep/SubmitFeedback"));

// ── Fallback ──────────────────────────────────────────────────
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <Spinner />
  </div>
);

function App() {
  const { init, isChecked } = useAuthStore();
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isChecked) {
      init();
    }
  }, [init, isChecked]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/register/shepherd" element={<ShepherdRegister />} />
            <Route path="/register/admin" element={<AdminRegister />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />

            {/* ── Public ── */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Admin ── */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DashLayout role="admin" />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route
                path="members"
                element={
                  <PermissionGate permissions={["members:read"]}>
                    <MembersPage />
                  </PermissionGate>
                }
              />
              <Route
                path="attendance"
                element={
                  <PermissionGate permissions={["attendance:read"]}>
                    <AdminAttendance />
                  </PermissionGate>
                }
              />
              <Route
                path="events"
                element={
                  <PermissionGate permissions={["events:read"]}>
                    <AdminEvents />
                  </PermissionGate>
                }
              />
              <Route
                path="shepherds"
                element={
                  <PermissionGate permissions={["shepherds:read"]}>
                    <AdminShepherds />
                  </PermissionGate>
                }
              />
              <Route
                path="regions"
                element={
                  <PermissionGate permissions={["settings:read"]}>
                    <RegionsPagesAdmin />
                  </PermissionGate>
                }
              />
              <Route
                path="reports"
                element={
                  <PermissionGate permissions={["reports:read"]}>
                    <AdminReports />
                  </PermissionGate>
                }
              />
              <Route
                path="admin-reports"
                element={
                  <PermissionGate permissions={["reports:read"]}>
                    <AdminBaseReport />
                  </PermissionGate>
                }
              />
              <Route
                path="invite"
                element={
                  <PermissionGate permissions={["shepherds:invite"]}>
                    <InviteShepherds />
                  </PermissionGate>
                }
              />
              <Route
                path="feedback"
                element={
                  <PermissionGate permissions={["settings:read"]}>
                    <AdminFeedback />
                  </PermissionGate>
                }
              />
              <Route
                path="diary"
                element={
                  <PermissionGate permissions={["settings:read"]}>
                    <PlaceholderPage />
                  </PermissionGate>
                }
              />
              <Route
                path="settings"
                element={
                  <PermissionGate permissions={["settings:read"]}>
                    <AdminSettings />
                  </PermissionGate>
                }
              />
            </Route>

            {/* ── Shepherd ── */}
            <Route
              path="/dashboard/shepherd"
              element={
                <ProtectedRoute roles={["shepherd"]}>
                  <DashLayout role="shepherd" />
                </ProtectedRoute>
              }
            >
              <Route index element={<ShepherdOverview />} />
              <Route
                path="sheep"
                element={
                  <PermissionGate permissions={["members:read"]}>
                    <ShepherdMySheep />
                  </PermissionGate>
                }
              />
              <Route
                path="attendance"
                element={
                  <PermissionGate permissions={["attendance:read"]}>
                    <ShepherdAttendance />
                  </PermissionGate>
                }
              />
              <Route
                path="events"
                element={
                  <PermissionGate permissions={["events:read"]}>
                    <ShepherdEvents />
                  </PermissionGate>
                }
              />
              <Route path="profile" element={<ShepherdProfile />} />
              <Route path="feedback" element={<ShepherdFeedback />} />
            </Route>

            {/* ── Sheep ── */}
            <Route
              path="/dashboard/sheep"
              element={
                <ProtectedRoute roles={["sheep"]}>
                  <DashLayout role="sheep" />
                </ProtectedRoute>
              }
            >
              <Route index element={<SheepProfile />} />
              <Route
                path="attendance"
                element={
                  <PermissionGate permissions={["attendance:read"]}>
                    <SheepAttendanceHistory />
                  </PermissionGate>
                }
              />
              <Route
                path="events"
                element={
                  <PermissionGate permissions={["events:read"]}>
                    <SheepEvents />
                  </PermissionGate>
                }
              />
              <Route path="feedback" element={<SubmitFeedback />} />
            </Route>

            {/* ── Misc ── */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
