import type { FC } from "react";

export const ArrowUp: FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 5l5 8H5l5-8z" />
  </svg>
);

export const ArrowDown: FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 15l-5-8h10l-5 8z" />
  </svg>
);
