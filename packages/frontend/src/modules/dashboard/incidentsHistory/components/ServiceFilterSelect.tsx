import * as Select from "@radix-ui/react-select";

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
  return (
    <div className="flex items-center">
      <Select.Root value={value} onValueChange={onValueChange}>
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
              {options.map((serviceName) => (
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
  );
};
