"use no memo";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { DrawerContent } from "@/components/dashboard/shepherds/types";
import {
  useShepherds,
  useShepherdStats,
  usePendingShepherds,
  useToggleShepherdStatus,
  useDeleteShepherd,
  useActivateShepherd,
  useDeactivateShepherd,
} from "@/hooks/queries/useShepherds";
import DetailDrawer from "@/components/dashboard/shepherds/DetailDrawer";
import StatsBar from "@/components/dashboard/shepherds/StatsBar";
import PendingApprovals from "@/components/dashboard/shepherds/PendingApprovals";
import ShepherdsTable from "@/components/dashboard/shepherds/ShepherdsTable";

const AdminShepherds: React.FC = () => {
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState<DrawerContent | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: shepherdsPage, isLoading: loadingShepherds } = useShepherds({
    search,
    page: pageIndex + 1,
    limit: pageSize,
  });
  const { data: stats } = useShepherdStats();
  const { data: pendingPage, isLoading: loadingPending } =
    usePendingShepherds();

  const shepherds = shepherdsPage?.data ?? [];
  const pending = pendingPage?.data ?? [];
  const totalItems = shepherdsPage?.pagination.total ?? 0;
  const pageCount = shepherdsPage?.pagination.totalPages ?? 0;

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { toggle: toggleStatus } = useToggleShepherdStatus();
  const { mutate: deleteShepherd } = useDeleteShepherd();
  const { mutate: approveShepherd } = useActivateShepherd();
  const { mutate: declineShepherd } = useDeactivateShepherd();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPageIndex(0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  // ── Drawer helpers ────────────────────────────────────────────────────────
  const pendingDrawerItem = drawer?.kind === "pending" ? drawer.data : null;

  const handleApproveFromDrawer = () => {
    if (!pendingDrawerItem) return;
    approveShepherd(pendingDrawerItem.id);
    setDrawer(null);
  };

  const handleDeclineFromDrawer = () => {
    if (!pendingDrawerItem) return;
    declineShepherd(pendingDrawerItem.id);
    setDrawer(null);
  };

  return (
    <>
      {/* Drawer */}
      <AnimatePresence>
        {drawer && (
          <DetailDrawer
            content={drawer}
            onClose={() => setDrawer(null)}
            onApprove={pendingDrawerItem ? handleApproveFromDrawer : undefined}
            onDecline={pendingDrawerItem ? handleDeclineFromDrawer : undefined}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="font-serif font-light text-[#0c0d0e] text-[28px] tracking-tight">
            Shepherds
          </h1>
          <p className="text-[13px] font-light text-slate-400 mt-0.5">
            Manage shepherds and their assigned members
          </p>
        </div>

        {/* Stats */}
        <StatsBar
          total={stats?.total ?? 0}
          active={stats?.active ?? 0}
          totalSheep={stats?.totalSheep ?? 0}
          avgRate={stats?.avgAttendanceRate ?? 0}
        />

        {/* Pending approvals */}
        <AnimatePresence>
          {!loadingPending && (
            <PendingApprovals
              pending={pending}
              onApprove={(id) => approveShepherd(id)}
              onDecline={(id) => declineShepherd(id)}
              onOpenDrawer={setDrawer}
            />
          )}
        </AnimatePresence>

        {/* Shepherds table */}
        <ShepherdsTable
          shepherds={shepherds}
          isLoading={loadingShepherds}
          search={search}
          onSearchChange={handleSearchChange}
          onDeactivate={(id) => {
            const s = shepherds.find((x) => x.id === id);
            if (s) toggleStatus(id, s.isActive ? "active" : "inactive");
          }}
          onDelete={(id) => deleteShepherd(id)}
          onOpenDrawer={setDrawer}
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPageIndex}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </>
  );
};

export default AdminShepherds;
