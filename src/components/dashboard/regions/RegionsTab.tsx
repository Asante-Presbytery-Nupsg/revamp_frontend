"use no memo";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";
import {
  useRegionsFlat,
  useCreateRegion,
  useUpdateRegion,
  useDeleteRegion,
  useCreatePresbytery,
  useUpdatePresbytery,
  useDeletePresbytery,
} from "@/hooks/queries/useRegions";
import { ConfirmDelete, InlineForm } from "./RegionPrimitives";

export const RegionsTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [addingRegion, setAddingRegion] = useState(false);
  const [newRegionName, setNewRegionName] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    new Set(),
  );
  const [addingPresb, setAddingPresb] = useState<string | null>(null);
  const [newPresbName, setNewPresbName] = useState("");
  const [editRegion, setEditRegion] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editPresb, setEditPresb] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    label: string;
    onConfirm: () => void;
  } | null>(null);

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: regions = [], isLoading } = useRegionsFlat();

  // ── Mutations ────────────────────────────────────────────────────────────────
  const { mutate: createRegion, isPending: creatingRegion } = useCreateRegion();
  const { mutate: updateRegion, isPending: updatingRegion } = useUpdateRegion();
  const { mutate: deleteRegion } = useDeleteRegion();
  const { mutate: createPresbytery, isPending: creatingPresb } =
    useCreatePresbytery();
  const { mutate: updatePresbytery, isPending: updatingPresb } =
    useUpdatePresbytery();
  const { mutate: deletePresbytery } = useDeletePresbytery();

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const saveRegion = () => {
    if (!newRegionName.trim()) return;
    createRegion(newRegionName.trim(), {
      onSuccess: () => {
        setNewRegionName("");
        setAddingRegion(false);
      },
    });
  };

  const saveUpdateRegion = () => {
    if (!editRegion?.name.trim()) return;
    updateRegion(
      { id: editRegion.id, name: editRegion.name.trim() },
      { onSuccess: () => setEditRegion(null) },
    );
  };

  const savePresb = (regionId: string) => {
    if (!newPresbName.trim()) return;
    createPresbytery(
      { regionId, name: newPresbName.trim() },
      {
        onSuccess: () => {
          setNewPresbName("");
          setAddingPresb(null);
        },
      },
    );
  };

  const saveUpdatePresb = () => {
    if (!editPresb?.name.trim()) return;
    updatePresbytery(
      { id: editPresb.id, name: editPresb.name.trim() },
      { onSuccess: () => setEditPresb(null) },
    );
  };

  // ── Filtered ─────────────────────────────────────────────────────────────────
  const filtered = search
    ? regions.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.presbyteries.some((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : regions;

  const totalPresb = regions.reduce((a, r) => a + r.presbyteries.length, 0);

  return (
    <>
      <AnimatePresence>
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
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Regions", value: regions.length },
            { label: "Presbyteries", value: totalPresb },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <p className="font-serif text-[30px] font-light text-[#0C447C]">
                {isLoading ? "—" : value}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search regions or presbyteries..."
                className="w-full pl-8 pr-8 py-2 text-[13px] border border-slate-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]
                           transition-colors placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <button
              onClick={() => setAddingRegion(true)}
              disabled={creatingRegion}
              className="flex items-center gap-2 px-4 py-2 bg-[#0C447C] hover:bg-[#185FA5] text-white text-[12px] font-medium rounded-md transition-colors shrink-0 disabled:opacity-50"
            >
              <Plus size={14} />
              <span className="hidden sm:block">Add Region</span>
            </button>
          </div>

          {/* Add region inline form */}
          <AnimatePresence>
            {addingRegion && (
              <div className="px-5 border-b border-slate-100">
                <InlineForm
                  placeholder="Region name e.g. Brong-Ahafo"
                  value={newRegionName}
                  onChange={setNewRegionName}
                  onSave={saveRegion}
                  onCancel={() => {
                    setAddingRegion(false);
                    setNewRegionName("");
                  }}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Regions list */}
          <div className="overflow-x-auto">
            <div className="min-w-120">
              {isLoading ? (
                <div className="px-5 py-14 text-center">
                  <p className="text-[13px] font-light text-slate-400">
                    Loading regions…
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <p className="text-[13px] font-light text-slate-400">
                    {search ? "No regions found." : "No regions yet."}
                  </p>
                </div>
              ) : (
                filtered.map((region) => {
                  const isOpen = expandedRegions.has(region.id);
                  const matchedPresb = search
                    ? region.presbyteries.filter((p) =>
                        p.name.toLowerCase().includes(search.toLowerCase()),
                      )
                    : region.presbyteries;

                  return (
                    <div
                      key={region.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      {/* Region row */}
                      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                        <button
                          onClick={() => toggleRegion(region.id)}
                          className="shrink-0"
                        >
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={15} className="text-slate-400" />
                          </motion.div>
                        </button>

                        <div className="w-8 h-8 rounded-lg bg-[#E6F1FB] flex items-center justify-center shrink-0">
                          <MapPin size={13} className="text-[#185FA5]" />
                        </div>

                        <div
                          className="flex-1 min-w-0 whitespace-nowrap"
                          onClick={() => toggleRegion(region.id)}
                        >
                          {editRegion?.id === region.id ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <InlineForm
                                placeholder="Region name"
                                value={editRegion.name}
                                onChange={(name) =>
                                  setEditRegion((e) =>
                                    e ? { ...e, name } : null,
                                  )
                                }
                                onSave={saveUpdateRegion}
                                onCancel={() => setEditRegion(null)}
                              />
                            </div>
                          ) : (
                            <div className="cursor-pointer">
                              <p className="text-[14px] font-semibold text-slate-900">
                                {region.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {region.presbyteries.length} presbyter
                                {region.presbyteries.length === 1 ? "y" : "ies"}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() =>
                              setEditRegion({
                                id: region.id,
                                name: region.name,
                              })
                            }
                            disabled={updatingRegion}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                label: region.name,
                                onConfirm: () => deleteRegion(region.id),
                              })
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Presbyteries */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="bg-slate-50/50 border-t border-slate-100 px-5 py-2">
                              {matchedPresb.map((p) => (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0 pl-8"
                                >
                                  <div className="flex-1 min-w-0 whitespace-nowrap">
                                    {editPresb?.id === p.id ? (
                                      <InlineForm
                                        placeholder="Presbytery name"
                                        value={editPresb.name}
                                        onChange={(name) =>
                                          setEditPresb((e) =>
                                            e ? { ...e, name } : null,
                                          )
                                        }
                                        onSave={saveUpdatePresb}
                                        onCancel={() => setEditPresb(null)}
                                      />
                                    ) : (
                                      <p className="text-[13px] text-slate-700">
                                        {p.name}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() =>
                                        setEditPresb({ id: p.id, name: p.name })
                                      }
                                      disabled={updatingPresb}
                                      className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white hover:text-slate-600 transition-colors disabled:opacity-40"
                                    >
                                      <Pencil size={12} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteTarget({
                                          label: p.name,
                                          onConfirm: () =>
                                            deletePresbytery(p.id),
                                        })
                                      }
                                      className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <AnimatePresence>
                                {addingPresb === region.id && (
                                  <div className="pl-8 py-1">
                                    <InlineForm
                                      placeholder="Presbytery name e.g. Obuasi Presbytery"
                                      value={newPresbName}
                                      onChange={setNewPresbName}
                                      onSave={() => savePresb(region.id)}
                                      onCancel={() => {
                                        setAddingPresb(null);
                                        setNewPresbName("");
                                      }}
                                    />
                                  </div>
                                )}
                              </AnimatePresence>

                              <button
                                onClick={() => {
                                  setAddingPresb(region.id);
                                  setNewPresbName("");
                                }}
                                disabled={creatingPresb}
                                className="flex items-center gap-1.5 text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2 py-2.5 pl-8 disabled:opacity-40"
                              >
                                <Plus size={12} /> Add presbytery
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegionsTab;
