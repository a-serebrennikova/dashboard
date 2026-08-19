import * as Select from "@radix-ui/react-select";

export type FilterSelectOption<T extends string> = {
  value: T;
  label: string;
};

type FilterSelectProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  ariaLabel: string;
  placeholder: string;
  options: readonly FilterSelectOption<T>[];
  containerClassName?: string;
  triggerClassName?: string;
};

export const FilterSelect = <T extends string>({
  value,
  onValueChange,
  ariaLabel,
  placeholder,
  options,
  containerClassName = "flex items-center",
  triggerClassName =
    "inline-flex min-w-[170px] items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-left text-xs text-slate-200 transition-colors data-[placeholder]:text-slate-500 data-[state=open]:border-slate-500 data-[state=open]:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60",
}: FilterSelectProps<T>) => {
  return (
    <div className={containerClassName}>
      <Select.Root
        value={value}
        // eslint-disable-next-line no-restricted-syntax
        onValueChange={(nextValue) => onValueChange(nextValue as T)}
      >
        <Select.Trigger
          className={triggerClassName}
          aria-label={ariaLabel}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="text-slate-500">▾</Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="z-50 overflow-hidden rounded-md border border-slate-700 bg-slate-950 text-xs text-slate-200 shadow-lg">
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 outline-none data-[highlighted]:bg-slate-800 data-[state=checked]:bg-slate-800 data-[state=checked]:text-slate-100"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
