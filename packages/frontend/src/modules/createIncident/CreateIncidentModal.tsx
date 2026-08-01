import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import type {
  CreateIncidentInput,
  Service,
} from "@package/dashboard-shared/dashboard";
import {
  CREATE_INCIDENT_FIELD_LIMITS,
  SEVERITY_OPTIONS,
  STATUS_OPTIONS,
  selectContentClassName,
  selectItemClassName,
  selectTriggerClassName,
} from "./consts";
import { IncidentDateTimeField } from "./components/IncidentDateTimeField";
import {
  createIncidentSchema,
  getDefaultFormValues,
  type CreateIncidentFormValues,
} from "./schema";
import { toIsoWithZeroSeconds } from "./utils/dateTimeUtils";

type CreateIncidentModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  services: Service[];
  onClose: () => void;
  onSubmit: (input: CreateIncidentInput) => Promise<void>;
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null;

const errorBorderClassName = "border-red-500 focus:border-red-400";

export const CreateIncidentModal = ({
  isOpen,
  isSubmitting,
  services,
  onClose,
  onSubmit,
}: CreateIncidentModalProps) => {
  const form = useForm<CreateIncidentFormValues>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: getDefaultFormValues(services[0]?.id),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit({
        serviceId: values.serviceId,
        title: values.title.trim(),
        description: values.description?.trim() || null,
        incidentAt: toIsoWithZeroSeconds(
          values.incidentDate,
          values.incidentTime,
        ),
        severity: values.severity,
        status: values.status,
      });
      onClose();
    } catch {
      // Keep form open on submit error.
    }
  });

  const {
    register,
    control,
    formState: { errors, isValid },
  } = form;

  const titleValue = useWatch({ control, name: "title" }) ?? "";
  const descriptionValue = useWatch({ control, name: "description" }) ?? "";

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => (!open ? onClose() : null)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/40 focus:outline-none">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-50">
                Create incident
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-slate-400">
                Add a new incident and publish it to the live dashboard.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isSubmitting}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close create incident form"
              >
                ×
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Service */}
              <div className="space-y-1 text-sm text-slate-300">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Service
                </span>
                <Controller
                  name="serviceId"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        className={`${selectTriggerClassName} ${errors.serviceId ? errorBorderClassName : ""}`}
                        aria-label="Choose service"
                        aria-invalid={Boolean(errors.serviceId)}
                      >
                        <Select.Value placeholder="Select service" />
                        <Select.Icon className="text-slate-500">▾</Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className={selectContentClassName}
                          position="popper"
                        >
                          <Select.Viewport className="p-1">
                            {services.length === 0 ? (
                              <div className="px-3 py-2 text-sm text-slate-500">
                                No services available
                              </div>
                            ) : (
                              services.map((service) => (
                                <Select.Item
                                  key={service.id}
                                  value={service.id}
                                  className={selectItemClassName}
                                >
                                  <Select.ItemText>
                                    {service.name}
                                  </Select.ItemText>
                                </Select.Item>
                              ))
                            )}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  )}
                />
                <FieldError message={errors.serviceId?.message} />
              </div>

              {/* Status */}
              <div className="space-y-1 text-sm text-slate-300">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Status
                </span>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        className={`${selectTriggerClassName} ${errors.status ? errorBorderClassName : ""}`}
                        aria-label="Choose status"
                        aria-invalid={Boolean(errors.status)}
                      >
                        <Select.Value />
                        <Select.Icon className="text-slate-500">▾</Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className={selectContentClassName}
                          position="popper"
                        >
                          <Select.Viewport className="p-1">
                            {STATUS_OPTIONS.map((status) => (
                              <Select.Item
                                key={status}
                                value={status}
                                className={selectItemClassName}
                              >
                                <Select.ItemText>{status}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  )}
                />
                <FieldError message={errors.status?.message} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label
                htmlFor="incident-title"
                className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500"
              >
                Title
              </label>
              <input
                id="incident-title"
                type="text"
                maxLength={CREATE_INCIDENT_FIELD_LIMITS.title}
                placeholder="Input title of the incident"
                className={`w-full rounded-xl border bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 ${errors.title ? errorBorderClassName : "border-slate-700 focus:border-slate-500"}`}
                aria-invalid={Boolean(errors.title)}
                {...register("title")}
              />
              <div className="flex items-start justify-between gap-3">
                <FieldError message={errors.title?.message} />
                <span className="mt-1 whitespace-nowrap text-xs text-slate-500">
                  {titleValue.length}/{CREATE_INCIDENT_FIELD_LIMITS.title}
                </span>
              </div>
            </div>

            {/* Incident time */}
            <div className="space-y-1">
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Incident time
              </span>
              <Controller
                name="incidentDate"
                control={control}
                render={({ field: dateField }) => (
                  <Controller
                    name="incidentTime"
                    control={control}
                    render={({ field: timeField }) => (
                      <IncidentDateTimeField
                        incidentDate={dateField.value}
                        incidentTime={timeField.value}
                        onDateChange={dateField.onChange}
                        onTimeChange={timeField.onChange}
                        hasError={Boolean(
                          errors.incidentDate || errors.incidentTime,
                        )}
                      />
                    )}
                  />
                )}
              />
              <FieldError
                message={
                  errors.incidentDate?.message ?? errors.incidentTime?.message
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
              {/* Description */}
              <div className="space-y-1">
                <label
                  htmlFor="incident-description"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500"
                >
                  Description
                </label>
                <textarea
                  id="incident-description"
                  rows={4}
                  maxLength={CREATE_INCIDENT_FIELD_LIMITS.description}
                  placeholder="Describe the issue and current impact"
                  className={`h-28 w-full resize-none rounded-xl border bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 ${errors.description ? errorBorderClassName : "border-slate-700 focus:border-slate-500"}`}
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
                />
                <div className="flex items-start justify-between gap-3">
                  <FieldError message={errors.description?.message} />
                  <span className="mt-1 whitespace-nowrap text-xs text-slate-500">
                    {descriptionValue.length}/
                    {CREATE_INCIDENT_FIELD_LIMITS.description}
                  </span>
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-1 text-sm text-slate-300">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Severity
                </span>
                <Controller
                  name="severity"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        className={`${selectTriggerClassName} ${errors.severity ? errorBorderClassName : ""}`}
                        aria-label="Choose severity"
                        aria-invalid={Boolean(errors.severity)}
                      >
                        <Select.Value />
                        <Select.Icon className="text-slate-500">▾</Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className={selectContentClassName}
                          position="popper"
                        >
                          <Select.Viewport className="p-1">
                            {SEVERITY_OPTIONS.map((severity) => (
                              <Select.Item
                                key={severity}
                                value={severity}
                                className={selectItemClassName}
                              >
                                <Select.ItemText>{severity}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  )}
                />
                <FieldError message={errors.severity?.message} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={
                  isSubmitting || (form.formState.isSubmitted && !isValid)
                }
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
