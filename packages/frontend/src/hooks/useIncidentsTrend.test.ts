import { renderHook } from "@testing-library/react";
import { vi, describe, expect, it } from "vitest";
import { useIncidentsTrend } from "./useIncidentsTrend";
import { makeDashboardPayload } from "../test/fixtures/dashboardPayload";

describe("useIncidentsTrend", () => {
  it("adds a trend point and replaces it for duplicate timestamps", () => {
    const firstPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      snapshot: {
        openCount: 4,
        criticalCount: 1,
        warningCount: 2,
        avgResponseTime: 180,
        lastUpdatedAt: "2026-06-27T10:00:00.000Z",
      },
    });

    const updatedSameSecondPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      snapshot: {
        openCount: 6,
        criticalCount: 2,
        warningCount: 3,
        avgResponseTime: 190,
        lastUpdatedAt: "2026-06-27T10:00:00.000Z",
      },
    });

    const { result, rerender } = renderHook(
      ({ payload }) => useIncidentsTrend(payload),
      {
        initialProps: {
          payload: null as ReturnType<typeof makeDashboardPayload> | null,
        },
      },
    );

    expect(result.current).toHaveLength(0);

    rerender({ payload: firstPayload });
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toMatchObject({
      total: 4,
      critical: 1,
    });

    rerender({ payload: updatedSameSecondPayload });
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toMatchObject({
      total: 6,
      critical: 2,
    });
  });

  it("skips invalid generatedAt values", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const validPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
    });

    const invalidPayload = makeDashboardPayload({
      generatedAt: "invalid-date",
    });

    const { result, rerender } = renderHook(
      ({ payload }) => useIncidentsTrend(payload),
      {
        initialProps: {
          payload: validPayload as ReturnType<
            typeof makeDashboardPayload
          > | null,
        },
      },
    );

    expect(result.current).toHaveLength(1);

    rerender({ payload: invalidPayload });
    expect(result.current).toHaveLength(1);
    expect(warnSpy).toHaveBeenCalledOnce();

    warnSpy.mockRestore();
  });
});
