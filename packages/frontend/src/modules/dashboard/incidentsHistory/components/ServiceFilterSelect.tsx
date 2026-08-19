import { FilterSelect } from "../../../../shared/ui/FilterSelect";

type ServiceFilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
};

export const ServiceFilterSelect = ({
  value,
  onValueChange,
  options,
}: ServiceFilterSelectProps) => {
  const selectOptions = [
    { value: "all", label: "All services" },
    ...options.map((serviceName) => ({
      value: serviceName,
      label: serviceName,
    })),
  ];

  return (
    <FilterSelect
      value={value}
      onValueChange={onValueChange}
      ariaLabel="Filter by service"
      placeholder="All services"
      options={selectOptions}
      containerClassName="w-full md:w-auto"
      triggerClassName="inline-flex w-full md:min-w-[170px] items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-left text-xs text-slate-200 transition-colors data-[placeholder]:text-slate-500 data-[state=open]:border-slate-500 data-[state=open]:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
    />
  );
};
