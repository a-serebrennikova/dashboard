type HeaderActionsProps = {
  onCreateIncident: () => void;
};

export const CreateIncidentButton = ({
  onCreateIncident,
}: HeaderActionsProps) => {
  return (
    <button
      type="button"
      onClick={onCreateIncident}
      className="inline-flex h-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 text-xs font-medium text-emerald-300 transition-colors duration-300 hover:bg-emerald-500/15 hover:text-emerald-200"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      Create incident
    </button>
  );
};
