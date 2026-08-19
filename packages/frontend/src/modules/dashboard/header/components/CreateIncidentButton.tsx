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
      className="custom-button"
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
