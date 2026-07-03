import { useMemo, useState, type FC } from "react";
import * as Select from "@radix-ui/react-select";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import { transformToTimeFormat } from "../../../utils/transformToTimeFormat";

const severityClasses = {
  critical: "border-red-400/30 text-red-400 bg-red-400/10",
  warning: "border-amber-400/30 text-amber-400 bg-amber-400/10",
  info: "border-slate-600 text-slate-400 bg-slate-800",
} as const;

interface EventListProps {
  events: DashboardPayload["recentEvents"];
}

const EVENT_TYPE_FILTERS = ["all", "created", "updated", "resolved"] as const;

type EventTypeFilter = (typeof EVENT_TYPE_FILTERS)[number];

export const EventList: FC<EventListProps> = ({ events }) => {
  const [filter, setFilter] = useState<EventTypeFilter>("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const serviceOptions = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.serviceName))).sort(
      (a, b) => a.localeCompare(b),
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const byType =
      filter === "all"
        ? sorted
        : sorted.filter((event) => event.type === filter);

    if (serviceFilter === "all") {
      return byType;
    }

    return byType.filter((event) => event.serviceName === serviceFilter);
  }, [events, filter, serviceFilter]);

  return (
    <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-slate-200 text-lg font-semibold">
          Incident history
        </h2>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex flex-wrap rounded-lg border border-slate-700 bg-slate-950/70 p-1">
          {EVENT_TYPE_FILTERS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              className={`rounded-md px-3 py-1.5 text-xs capitalize transition-colors ${
                filter === type
                  ? "bg-slate-700 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <Select.Root value={serviceFilter} onValueChange={setServiceFilter}>
            <Select.Trigger
              className="inline-flex min-w-[170px] items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-left text-xs text-slate-200 outline-none transition-colors hover:border-slate-600 data-[placeholder]:text-slate-500"
              aria-label="Filter by service"
            >
              <Select.Value placeholder="All services" />
              <Select.Icon className="text-slate-500">▾</Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="z-50 overflow-hidden rounded-md border border-slate-700 bg-slate-950 text-xs text-slate-200 shadow-lg">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="all"
                    className="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 outline-none data-[highlighted]:bg-slate-800 data-[state=checked]:text-slate-100"
                  >
                    <Select.ItemText>All services</Select.ItemText>
                  </Select.Item>
                  {serviceOptions.map((serviceName) => (
                    <Select.Item
                      key={serviceName}
                      value={serviceName}
                      className="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 outline-none data-[highlighted]:bg-slate-800 data-[state=checked]:text-slate-100"
                    >
                      <Select.ItemText>{serviceName}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="h-[360px] overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-md border border-slate-700 bg-slate-950/40 px-3 py-4 text-sm text-slate-500 text-center">
            No events for selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-slate-100 font-medium">
                    {event.message}
                  </div>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full border whitespace-nowrap ${severityClasses[event.severity ?? "info"]}`}
                  >
                    {event.type}
                  </span>
                </div>
                <div className="mt-1 text-slate-500 text-xs">
                  {event.incidentTitle} · {event.serviceName}
                </div>
                <div className="mt-1 text-slate-500 text-xs">
                  {transformToTimeFormat(event.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
