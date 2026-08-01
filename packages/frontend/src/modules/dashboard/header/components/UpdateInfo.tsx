import { Spinner } from "../../../../shared/ui/Spinner";

type UpdateInfoProps = {
  lastUpdatedLabel: string;
  isRetryCooldown: boolean;
  onRetry: () => void;
};

export const UpdateInfo = ({
  lastUpdatedLabel,
  isRetryCooldown,
  onRetry,
}: UpdateInfoProps) => {
  return (
    <div className="flex w-full max-w-max min-w-0 items-center gap-2.5 rounded-2xl border border-slate-800/80 bg-slate-900/45 p-1.5 pr-3 backdrop-blur-sm lg:gap-2 lg:pr-2.5">
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetryCooldown}
        aria-label={isRetryCooldown ? "Retry in progress" : "Retry connection"}
        title={isRetryCooldown ? "Retrying" : "Retry"}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/70 text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 lg:h-9 lg:w-9"
      >
        {isRetryCooldown ? (
          <Spinner size="sm" toneClassName="text-slate-100" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M20 12a8 8 0 1 1-2.34-5.66"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 4v5h-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-400">Last updated</div>
        <div className="whitespace-nowrap text-sm font-semibold text-slate-100 tabular-nums lg:text-[15px]">
          {lastUpdatedLabel}
        </div>
      </div>
    </div>
  );
};
