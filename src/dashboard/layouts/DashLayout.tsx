import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import DashHeader from "./DashHeader";
import { type Role } from "../nav.config";
import { useAuthStore } from "@/store/useAuthStore";

interface DashLayoutProps {
  role: Role;
  notificationCount?: number;
}

const DashLayout: React.FC<DashLayoutProps> = ({ role, notificationCount }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  const authUser = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email ?? "",
        initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
      }
    : { name: "User", email: "", initials: "U" };

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:block">
        <Sidebar role={role} user={authUser} />
      </div>

      {/* ── Mobile sidebar drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#0c0d0e]/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar
                role={role}
                user={authUser}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashHeader
          role={role}
          onMenuOpen={() => setMobileOpen(true)}
          notificationCount={notificationCount}
        />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
