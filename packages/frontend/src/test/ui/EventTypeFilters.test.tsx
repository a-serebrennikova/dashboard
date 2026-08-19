import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EventTypeFilters } from "../../modules/dashboard/incidentsHistory/components/EventTypeFilters";

describe("EventTypeFilters", () => {
  it("renders a select trigger for mobile filtering", () => {
    render(
      <EventTypeFilters
        filters={["all", "created", "updated", "resolved"]}
        activeFilter="all"
        onFilterChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", { name: /filter by event type/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("All events")).toBeInTheDocument();
  });
});
