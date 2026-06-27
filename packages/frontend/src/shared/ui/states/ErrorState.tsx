import type { ReactNode } from "react";

interface ErrorStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title,
  message,
  icon = "⚠️",
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-10 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-5xl">{icon}</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
          <p className="text-sm leading-6 text-slate-400">{message}</p>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
