import React from "react";
import { motion, type Variants } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import StatsGrid from "@/components/dashboard/overview/StatsGrid";
import AttendanceChart from "@/components/dashboard/overview/AttendanceChart";
import RegionalChart from "@/components/dashboard/overview/RegionalChart";
import RecentMembersTable from "@/components/dashboard/overview/RecentMembersTable";
import PendingShepherds from "@/components/dashboard/overview/PendingShepherds";
import UpcomingEvents from "@/components/dashboard/overview/UpcomingEvents";
import { useAuthStore } from "@/store/useAuthStore";

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const AdminOverview: React.FC = () => {
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  const greeting = getGreeting();
  const firstName = user?.firstName ?? "Admin";

  if (isLoading)
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="h-8 w-64 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Greeting */}
      <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
        <h1 className="font-serif font-light text-[#0c0d0e] text-[26px] tracking-tight leading-tight">
          {greeting}, <em className="italic text-[#185FA5]">{firstName}.</em>
        </h1>
        <p className="text-[13px] font-light text-slate-400 mt-0.5">
          Here's what's happening across NUPS-G today.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp(0.06)} initial="hidden" animate="visible">
        <StatsGrid />
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={fadeUp(0.1)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-3 gap-4"
      >
        <AttendanceChart />
        <RegionalChart />
      </motion.div>

      {/* Recent Members */}
      <motion.div
        variants={fadeUp(0.14)}
        initial="hidden"
        animate="visible"
        className="relative z-0"
      >
        <ErrorBoundary fallback={<div className="h-40" />}>
          <RecentMembersTable />
        </ErrorBoundary>
      </motion.div>

      {/* Pending Shepherds + Upcoming Events */}
      <motion.div
        variants={fadeUp(0.18)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-2 gap-4"
      >
        <PendingShepherds />
        <UpcomingEvents />
      </motion.div>
    </div>
  );
};

export default AdminOverview;
