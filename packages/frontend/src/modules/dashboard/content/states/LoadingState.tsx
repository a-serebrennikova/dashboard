import { Spinner } from "../../../../shared/ui/Spinner";

interface LoadingStateProps {
  title?: string;
  message?: string;
  fullPage?: boolean;
}

export function LoadingState({
  title = "Loading data",
  message = "Please wait...",
  fullPage = false,
}: LoadingStateProps) {
  const containerClasses = fullPage
    ? "flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center"
    : "flex items-center justify-center p-6 text-center";

  return (
    <div className={containerClasses}>
      <div className="max-w-md space-y-4">
        <div className="flex justify-center text-slate-400">
          <Spinner />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <p className="text-sm leading-6 text-slate-400">{message}</p>
        </div>
      </div>
    </div>
  );
}
