"use no memo";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Building2 } from "lucide-react";
import { INST_TYPES, TYPE_BADGE } from "./regionData";
import type { Institution } from "@/api/institutions.api";
import { ConfirmDelete } from "./RegionPrimitives";
import { InstForm } from "./InstForm";
import { Pagination } from "@/components/shared/Pagination";
import {
  useInstitutions,
  useCreateInstitution,
  useUpdateInstitution,
  useDeleteInstitution,
} from "@/hooks/queries/useInstitutions";

// ─── Types ────────────────────────────────────────────────────────────────────

type InstModal = { mode: "add" } | { mode: "edit"; inst: Institution } | null;

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

// ─── Component ────────────────────────────────────────────────────────────────

export const InstitutionsTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [modal, setModal] = useState<InstModal>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    label: string;
    onConfirm: () => void;
  } | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: page, isLoading } = useInstitutions({
    search: search || undefined,
    type:
      typeFilter !== "All" ? (typeFilter as Institution["type"]) : undefined,
    page: pageIndex + 1,
    limit: pageSize,
  });

  // Separate query for stats — all institutions unfiltered
  const { data: allPage } = useInstitutions({ limit: 1000 });
  const allInstitutions = allPage?.data ?? [];

  const institutions = page?.data ?? [];
  const totalItems = page?.pagination.total ?? 0;
  const pageCount = page?.pagination.totalPages ?? 0;

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutate: createInstitution, isPending: creating } =
    useCreateInstitution();
  const { mutate: updateInstitution, isPending: updating } =
    useUpdateInstitution();
  const { mutate: deleteInstitution } = useDeleteInstitution();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = (v: string) => {
    setSearch(v);
    setPageIndex(0);
  };

  const handleFilter = (v: string) => {
    setTypeFilter(v);
    setPageIndex(0);
  };

  const handleSave = (data: Omit<Institution, "id">) => {
    if (modal?.mode === "edit") {
      updateInstitution(
        { id: modal.inst.id, ...data },
        { onSuccess: () => setModal(null) },
      );
    } else {
      createInstitution(data, { onSuccess: () => setModal(null) });
    }
  };

  return (
    <>
      <AnimatePresence>
        {modal && (
          <InstForm
            initial={modal.mode === "edit" ? modal.inst : undefined}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
        {deleteTarget && (
          <ConfirmDelete
            label={deleteTarget.label}
            onConfirm={deleteTarget.onConfirm}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {INST_TYPES.map((t) => (
            <div
              key={t}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <p className="font-serif text-[30px] font-light text-[#0C447C] leading-none">
                {isLoading
                  ? "—"
                  : allInstitutions.filter((i) => i.type === t).length}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1.5">
                {t}
              </p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search institutions..."
                  className="w-full pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-lg bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                             transition-colors placeholder:text-slate-400"
                />
                {search && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setModal({ mode: "add" })}
                disabled={creating}
                className="flex items-center gap-2 px-4 py-2 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[12px] font-medium rounded-md transition-colors shrink-0 disabled:opacity-50"
              >
                <Plus size={14} />
                <span className="hidden sm:block">Add Institution</span>
              </button>
            </div>

            {/* Type filter pills */}
            <div
              className="flex gap-1 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {["All", ...INST_TYPES].map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                    typeFilter === t
                      ? "bg-[#0C447C] text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-130">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  {["Institution", "Short Name", "Type", "Location", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <p className="text-[13px] font-light text-slate-400">
                        Loading institutions…
                      </p>
                    </td>
                  </tr>
                ) : institutions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <p className="text-[13px] font-light text-slate-400">
                        {search || typeFilter !== "All"
                          ? "No institutions found."
                          : "No institutions yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  institutions.map((inst) => (
                    <tr
                      key={inst.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Building2 size={13} className="text-slate-400" />
                          </div>
                          <p className="text-[13px] font-medium text-slate-900 line-clamp-2">
                            {inst.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-[12px] font-semibold text-slate-600">
                          {inst.shortName ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {inst.type ? (
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${TYPE_BADGE[inst.type]}`}
                          >
                            {inst.type}
                          </span>
                        ) : (
                          <span className="text-[12px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[12px] text-slate-500">
                        {inst.location ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setModal({ mode: "edit", inst })}
                            disabled={updating}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                label: inst.name,
                                onConfirm: () => deleteInstitution(inst.id),
                              })
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <Pagination
              pageIndex={pageIndex}
              pageCount={pageCount}
              pageSize={pageSize}
              totalFiltered={totalItems}
              onPageChange={setPageIndex}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPageIndex(0);
              }}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default InstitutionsTab;
