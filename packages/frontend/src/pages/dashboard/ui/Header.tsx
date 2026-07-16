import { StatusBadge } from "../../../modules/connection/ui/StatusBadge";
import { useDashboardActions } from "../../../contexts/useDashboardActions";
import { useDashboardConnection } from "../../../contexts/useDashboardConnection";
import { useDashboardDataState } from "../../../contexts/useDashboardDataState";
import { formatDateTime } from "../../../utils/formatDateTime";
import { Spinner } from "./states/LoadingState";

export const Header = () => {
  const { connectionStatus } = useDashboardConnection();
  const { retryNow, isRetryCooldown } = useDashboardActions();
  const { data } = useDashboardDataState();
  const lastUpdatedLabel = data?.generatedAt
    ? formatDateTime(data.generatedAt)
    : "--/--, --:--:-- --";

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Incident monitoring
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-50">
          Live Dashboard
        </h1>
      </div>
      <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 px-1 py-1">
          <button
            type="button"
            onClick={retryNow}
            disabled={isRetryCooldown}
            aria-label={
              isRetryCooldown ? "Retry in progress" : "Retry connection"
            }
            title={isRetryCooldown ? "Retrying" : "Retry"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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

          <div>
            <div className="text-xs font-medium text-slate-400">
              Last updated
            </div>
            <div className="text-sm font-semibold text-slate-100 tabular-nums">
              {lastUpdatedLabel}
            </div>
          </div>
        </div>
        <StatusBadge connectionStatus={connectionStatus} />
      </div>
    </div>
  );
};
