import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDashboardKpiModel } from "../../modules/dashboard/utils/useDashboardKpiModel";
import { makeDashboardPayload } from "../utils/dashboardPayload";
import { firstIncidents, secondIncidents } from "../data/incidents";

type DashboardPayloadLike = ReturnType<typeof makeDashboardPayload>;

describe("useDashboardKpiModel", () => {
  it("returns an empty model when data is null", () => {
    const { result } = renderHook(() => useDashboardKpiModel(null));

    expect(result.current).toMatchObject({
      activeServicesCount: 0,
      openCount: 0,
      criticalCount: 0,
      generatedAt: "",
      lastUpdatedAt: "",
      previousKpi: null,
    });
  });

  it("tracks previous KPI after a new snapshot", () => {
    const firstPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      incidents: firstIncidents,
    });

    const secondPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:05.000Z",
      incidents: secondIncidents,
    });

    const { result, rerender } = renderHook(
      ({ payload }: { payload: DashboardPayloadLike | null }) =>
        useDashboardKpiModel(payload),
      {
        initialProps: {
          payload: firstPayload as DashboardPayloadLike | null,
        },
      },
    );

    expect(result.current.activeServicesCount).toBe(1);
    expect(result.current.previousKpi).toBeNull();

    rerender({ payload: secondPayload });

    expect(result.current.activeServicesCount).toBe(1);
    expect(result.current.openCount).toBe(7);
    expect(result.current.criticalCount).toBe(2);
    expect(result.current.warningCount).toBe(4);
    expect(result.current.previousKpi).toMatchObject({
      activeServices: 1,
      openIncidents: 4,
    });
  });

  it("does not update previousKpi when generatedAt is unchanged", () => {
    const firstPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      incidents: firstIncidents,
    });

    const sameGeneratedAtPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      incidents: secondIncidents,
    });

    const { result, rerender } = renderHook(
      ({ payload }: { payload: DashboardPayloadLike | null }) =>
        useDashboardKpiModel(payload),
      {
        initialProps: {
          payload: firstPayload as DashboardPayloadLike | null,
        },
      },
    );

    expect(result.current.previousKpi).toBeNull();

    rerender({ payload: sameGeneratedAtPayload });
    expect(result.current.previousKpi).toBeNull();
  });
});
