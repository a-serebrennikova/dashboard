interface LoadingStateProps {
  title?: string;
  message?: string;
  fullPage?: boolean;
}

type SpinnerSize = "sm" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  toneClassName?: string;
}

export function Spinner({
  size = "lg",
  toneClassName = "text-slate-400",
}: SpinnerProps) {
  const sizeClassName = size === "sm" ? "w-4 h-4" : "w-12 h-12";

  return (
    <svg
      className={`${sizeClassName} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className={`opacity-75 ${toneClassName}`}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
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
