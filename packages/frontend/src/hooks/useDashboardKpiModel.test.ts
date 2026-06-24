import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDashboardKpiModel } from "../modules/dashboard/utils/useDashboardKpiModel";
import { makeDashboardPayload } from "../test/fixtures/dashboardPayload";

describe("useDashboardKpiModel", () => {
  it("returns an empty model when data is null", () => {
    const { result } = renderHook(() => useDashboardKpiModel(null));

    expect(result.current).toMatchObject({
      activeServicesCount: 0,
      openCount: 0,
      criticalCount: 0,
      avgResponseTime: 0,
      generatedAt: "",
      lastUpdatedAt: "",
      previousKpi: null,
    });
  });

  it("tracks previous KPI after a new snapshot", () => {
    const firstPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      snapshot: {
        openCount: 4,
        criticalCount: 1,
        warningCount: 2,
        avgResponseTime: 180,
        lastUpdatedAt: "2026-06-27T10:00:00.000Z",
      },
      services: [
        {
          id: "svc-1",
          name: "Payments API",
          team: "Core",
          isActive: true,
          createdAt: "2026-06-27T10:00:00.000Z",
          updatedAt: "2026-06-27T10:00:00.000Z",
        },
      ],
    });

    const secondPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:05.000Z",
      snapshot: {
        openCount: 7,
        criticalCount: 2,
        warningCount: 3,
        avgResponseTime: 220,
        lastUpdatedAt: "2026-06-27T10:00:05.000Z",
      },
      services: [
        {
          id: "svc-1",
          name: "Payments API",
          team: "Core",
          isActive: true,
          createdAt: "2026-06-27T10:00:00.000Z",
          updatedAt: "2026-06-27T10:00:05.000Z",
        },
        {
          id: "svc-2",
          name: "Auth API",
          team: "Identity",
          isActive: true,
          createdAt: "2026-06-27T10:00:00.000Z",
          updatedAt: "2026-06-27T10:00:05.000Z",
        },
      ],
    });

    const { result, rerender } = renderHook(
      ({ payload }) => useDashboardKpiModel(payload),
      {
        initialProps: {
          payload: firstPayload,
        },
      },
    );

    expect(result.current.activeServicesCount).toBe(1);
    expect(result.current.previousKpi).toBeNull();

    rerender({ payload: secondPayload });

    expect(result.current.activeServicesCount).toBe(2);
    expect(result.current.openCount).toBe(7);
    expect(result.current.previousKpi).toMatchObject({
      activeServices: 1,
      openIncidents: 4,
    });
  });
});
