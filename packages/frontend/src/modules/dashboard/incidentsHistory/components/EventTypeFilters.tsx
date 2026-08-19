import { FilterSelect } from "../../../../shared/ui/FilterSelect";

type EventTypeFilter = "all" | "created" | "updated" | "resolved";

type EventTypeFiltersProps = {
  filters: readonly EventTypeFilter[];
  activeFilter: EventTypeFilter;
  onFilterChange: (value: EventTypeFilter) => void;
};

const EVENT_TYPE_LABELS: Record<EventTypeFilter, string> = {
  all: "All events",
  created: "Created",
  updated: "Updated",
  resolved: "Resolved",
};

export const EventTypeFilters = ({
  filters,
  activeFilter,
  onFilterChange,
}: EventTypeFiltersProps) => {
  return (
    <>
      <div className="hidden md:inline-flex flex-wrap rounded-lg border border-slate-700 bg-slate-950/70 p-1 text-sm">
        {filters.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onFilterChange(type)}
            className={`rounded-md px-3 py-1.5 capitalize transition-colors ${
              activeFilter === type
                ? "bg-slate-700 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="w-full md:hidden">
        <FilterSelect
          value={activeFilter}
          onValueChange={onFilterChange}
          ariaLabel="Filter by event type"
          placeholder="All events"
          options={filters.map((type) => ({
            value: type,
            label: EVENT_TYPE_LABELS[type],
          }))}
          containerClassName="w-full"
          triggerClassName="inline-flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-left text-xs text-slate-200 outline-none transition-colors hover:border-slate-600 data-[placeholder]:text-slate-500"
        />
      </div>
    </>
  );
};
