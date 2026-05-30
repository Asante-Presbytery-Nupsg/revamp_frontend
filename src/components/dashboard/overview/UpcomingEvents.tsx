"use no memo";

import React, { useMemo } from "react";
import { ArrowUpRight, MapPin, Loader2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import Card from "./Card";
import { useEvents } from "@/hooks/queries/useEvents";

type Event = {
  title: string;
  date: string;
  location: string;
};

const colHelper = createColumnHelper<Event>();

const formatEventDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const UpcomingEvents: React.FC = () => {
  const { data: response, isLoading } = useEvents({
    status: "upcoming",
    limit: 5,
  });

  const events = response?.data.slice(0, 3) ?? [];

  const columns = useMemo(
    () => [
      colHelper.accessor("title", {
        header: "Event",
        cell: (info) => (
          <p className="text-[13px] font-medium text-slate-900 whitespace-nowrap">
            {info.getValue()}
          </p>
        ),
      }),
      colHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-[12px] font-medium text-[#185FA5] whitespace-nowrap">
            {formatEventDate(info.getValue())}
          </span>
        ),
      }),
      colHelper.accessor("location", {
        header: "Location",
        cell: (info) => (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <MapPin size={10} className="text-slate-300 shrink-0" />
            <span className="text-[12px] text-slate-400">
              {info.getValue() ?? "—"}
            </span>
          </div>
        ),
      }),
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">
            Upcoming Events
          </h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Scheduled national gatherings
          </p>
        </div>
        <button className="text-[12px] font-medium text-[#185FA5] hover:underline underline-offset-2 flex items-center gap-1 shrink-0">
          View all <ArrowUpRight size={13} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={20} className="text-slate-300 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-[13px] text-slate-400 font-light">
            No upcoming events
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-50">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-5 py-3 text-left text-[10px] font-medium tracking-[0.08em] uppercase text-slate-400"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default UpcomingEvents;
