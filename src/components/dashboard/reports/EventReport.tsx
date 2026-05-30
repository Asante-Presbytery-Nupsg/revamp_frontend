import { FileText, Users, TrendingUp, CalendarCheck } from "lucide-react";
import { Card, StatCard, SectionTitle, ExportBtn } from "./ReportPrimitives";
import { useEventReport } from "@/hooks/queries/useReports";

const TABLE_HEADERS = [
  "Event",
  "Type",
  "Date",
  "Registered",
  "Capacity",
  "Fill Rate",
];

export const EventReport: React.FC = () => {
  const { data, isLoading } = useEventReport();

  const total = data?.total ?? 0;
  const totalRegistered = data?.totalRegistered ?? 0;
  const totalCap = data?.totalCap ?? 0;
  const overallFill = data?.overallFill ?? 0;
  const eventList = data?.events ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={isLoading ? "—" : total}
          icon={<FileText size={16} />}
          iconBg="bg-[#E6F1FB]"
          iconColor="text-[#185FA5]"
        />
        <StatCard
          label="Total Registered"
          value={isLoading ? "—" : totalRegistered.toLocaleString()}
          icon={<Users size={16} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          valueColor="text-green-700"
        />
        <StatCard
          label="Total Capacity"
          value={isLoading ? "—" : totalCap.toLocaleString()}
          icon={<TrendingUp size={16} />}
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
        />
        <StatCard
          label="Overall Fill"
          value={isLoading ? "—" : `${overallFill}%`}
          icon={<CalendarCheck size={16} />}
          iconBg="bg-[#E6F1FB]"
          iconColor="text-[#185FA5]"
          valueColor="text-[#185FA5]"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <SectionTitle>Event Summary</SectionTitle>
          <ExportBtn format="CSV" onClick={() => {}} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-140">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[13px] text-slate-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : eventList.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[13px] text-slate-400"
                  >
                    No events yet.
                  </td>
                </tr>
              ) : (
                eventList.map((e) => {
                  const fill =
                    e.cap > 0 ? Math.round((e.registered / e.cap) * 100) : 0;
                  return (
                    <tr
                      key={e.name + e.date}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="text-[13px] font-medium text-slate-900">
                          {e.name}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5] capitalize">
                          {e.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[12px] text-slate-500">
                        {e.date}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[13px] font-medium text-slate-700">
                        {e.registered}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-[12px] text-slate-400">
                        {e.cap}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${fill >= 90 ? "bg-amber-400" : "bg-[#185FA5]"}`}
                              style={{ width: `${Math.min(fill, 100)}%` }}
                            />
                          </div>
                          <span className="text-[12px] font-semibold text-slate-700">
                            {fill}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EventReport;
