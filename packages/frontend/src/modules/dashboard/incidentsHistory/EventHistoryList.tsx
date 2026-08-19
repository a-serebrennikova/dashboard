import { useMemo, useState, type FC } from "react";
import type {
  DashboardPayload,
  Service,
} from "@package/dashboard-shared/dashboard";
import { EventTypeFilters } from "./components/EventTypeFilters";
import { ServiceFilterSelect } from "./components/ServiceFilterSelect";
import { Card } from "./components/Card";

interface EventListProps {
  events: DashboardPayload["events"];
  services: Service[];
}

const EVENT_TYPE_FILTERS = ["all", "created", "updated", "resolved"] as const;

type EventTypeFilter = (typeof EVENT_TYPE_FILTERS)[number];

export const EventHistoryList: FC<EventListProps> = ({ events, services }) => {
  const [filter, setFilter] = useState<EventTypeFilter>("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const serviceOptions = useMemo(() => {
    return services.map((service) => service.name);
  }, [services]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesType = filter === "all" || event.type === filter;
      const matchesService =
        serviceFilter === "all" || event.serviceName === serviceFilter;

      return matchesType && matchesService;
    });
  }, [events, filter, serviceFilter]);

  const changeFilter = (newFilter: EventTypeFilter) => {
    setFilter(newFilter);
  };

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900 p-5 text-base">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-200">
          Incident history
        </h2>
      </div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:flex-1">
          <EventTypeFilters
            filters={EVENT_TYPE_FILTERS}
            activeFilter={filter}
            onFilterChange={changeFilter}
          />
        </div>

        <div className="w-full md:w-auto md:flex-none">
          <ServiceFilterSelect
            value={serviceFilter}
            onValueChange={setServiceFilter}
            options={serviceOptions}
          />
        </div>
      </div>

      <div className="h-[520px] overflow-y-auto overscroll-y-contain pr-1">
        {filteredEvents.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-md border border-slate-700 bg-slate-950/40 px-3 py-4 text-center text-sm text-slate-500">
            No events for selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                incidentId={event.incidentId}
                incidentTitle={event.incidentTitle}
                serviceName={event.serviceName}
                type={event.type}
                message={event.message}
                severity={event.severity}
                createdAt={event.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
