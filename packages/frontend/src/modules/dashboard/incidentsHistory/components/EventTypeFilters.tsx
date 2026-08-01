type EventTypeFilter = "all" | "created" | "updated" | "resolved";

type EventTypeFiltersProps = {
  filters: readonly EventTypeFilter[];
  activeFilter: EventTypeFilter;
  onFilterChange: (value: EventTypeFilter) => void;
};

export const EventTypeFilters = ({
  filters,
  activeFilter,
  onFilterChange,
}: EventTypeFiltersProps) => {
  return (
    <div className="inline-flex flex-wrap rounded-lg border border-slate-700 bg-slate-950/70 p-1">
      {filters.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onFilterChange(type)}
          className={`rounded-md px-3 py-1.5 text-xs capitalize transition-colors ${
            activeFilter === type
              ? "bg-slate-700 text-slate-100"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};
