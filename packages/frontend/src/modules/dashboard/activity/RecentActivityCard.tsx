import type { DashboardPayload } from "@package/dashboard-shared/dashboard";

type RecentActivityCardProps = {
  events: DashboardPayload["events"];
};

export const RecentActivityCard = ({ events }: RecentActivityCardProps) => {
  return (
    <div className="flex min-h-[320px] flex-col rounded-lg border border-slate-700 bg-slate-900 p-5">
      <h3 className="text-base font-medium text-slate-200 mb-4">
        Recent activity
      </h3>
      <div className="flex flex-1 flex-col justify-between space-y-3 text-sm">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="min-h-[64px] pb-2 border-b border-slate-800 last:border-0"
          >
            <div className="flex items-start gap-2">
              <div
                className={`w-2 h-2 rounded-full mt-[0.45rem] flex-shrink-0 ${
                  event.type === "created"
                    ? "bg-blue-400"
                    : event.type === "resolved"
                      ? "bg-emerald-400"
                      : "bg-yellow-400"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="text-slate-300 line-clamp-2">
                  {event.message}
                </div>
                <div className="text-slate-500 mt-0.5 text-xs">
                  {event.serviceName}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
