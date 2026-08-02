import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { selectTriggerClassName } from "../consts";
import { formatIncidentDateTimeDisplay } from "../utils/dateTimeUtils";

type IncidentDateTimeFieldProps = {
  incidentDate: string;
  incidentTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  hasError?: boolean;
};

export const IncidentDateTimeField = ({
  incidentDate,
  incidentTime,
  onDateChange,
  onTimeChange,
  hasError = false,
}: IncidentDateTimeFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerLabel = formatIncidentDateTimeDisplay(
    incidentDate,
    incidentTime,
  );

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen} modal>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`${selectTriggerClassName} ${hasError ? "border-red-500 focus:border-red-400" : ""}`}
          aria-label="Choose incident date and time"
          aria-invalid={hasError}
        >
          <span>{triggerLabel}</span>
          <span className="text-slate-100">▾</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50 w-[min(84vw,280px)] rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-sm text-slate-100 shadow-2xl shadow-slate-950/40"
        >
          <div className="space-y-2.5">
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
                Day
              </span>
              <input
                type="date"
                value={incidentDate}
                onChange={(event) => onDateChange(event.target.value)}
                className={`incident-datetime-input w-full rounded-lg border bg-slate-900 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition ${hasError ? "border-red-500 focus:border-red-400" : "border-slate-700 focus:border-slate-500"}`}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
                Time (HH:mm)
              </span>
              <input
                type="time"
                step={60}
                value={incidentTime}
                onChange={(event) => onTimeChange(event.target.value)}
                className={`incident-datetime-input w-full rounded-lg border bg-slate-900 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition ${hasError ? "border-red-500 focus:border-red-400" : "border-slate-700 focus:border-slate-500"}`}
              />
            </label>
            <p className="text-xs text-slate-500">
              Seconds are saved automatically as 00.
            </p>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
