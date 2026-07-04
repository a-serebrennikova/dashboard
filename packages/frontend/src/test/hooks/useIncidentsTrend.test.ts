import { renderHook } from "@testing-library/react";
import { vi, describe, expect, it } from "vitest";
import { useIncidentsTrend } from "../../hooks/useIncidentsTrend";
import { makeDashboardPayload } from "../utils/dashboardPayload";
import {
  createIncidentAt,
  firstIncidents,
  secondIncidents,
} from "../data/incidents";

type DashboardPayloadLike = ReturnType<typeof makeDashboardPayload>;

describe("useIncidentsTrend", () => {
  it("adds a trend point and replaces it for duplicate timestamps", () => {
    const firstPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      incidents: firstIncidents,
    });

    const updatedSameSecondPayload = makeDashboardPayload({
      generatedAt: "2026-06-27T10:00:00.000Z",
      incidents: secondIncidents,
    });

    const { result, rerender } = renderHook(
      ({ payload }: { payload: DashboardPayloadLike | null }) =>
        useIncidentsTrend(payload),
      {
        initialProps: {
          payload: null as DashboardPayloadLike | null,
        },
      },
    );

    expect(result.current).toHaveLength(0);

    rerender({ payload: firstPayload });
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toMatchObject({
      total: 4,
      critical: 1,
      warning: 2,
    });

    rerender({ payload: updatedSameSecondPayload });
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toMatchObject({
      total: 4,
      critical: 1,
      warning: 2,
    });
    expect(result.current[1]).toMatchObject({
      total: 7,
      critical: 2,
      warning: 4,
    });
  });

  it("skips payload when latest incident updatedAt is invalid", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const validPayload = makeDashboardPayload({ incidents: firstIncidents });

    const invalidPayload = makeDashboardPayload({
      incidents: [
        {
          id: "inc-bad",
          serviceId: "svc-1",
          serviceName: "Payments API",
          title: "Bad timestamp",
          description: null,
          severity: "warning",
          status: "open",
          createdAt: "2026-06-27T10:00:00.000Z",
          updatedAt: "not-a-date",
          resolvedAt: null,
        },
      ],
    });

    const { result, rerender } = renderHook(
      ({ payload }: { payload: DashboardPayloadLike | null }) =>
        useIncidentsTrend(payload),
      {
        initialProps: {
          payload: validPayload as DashboardPayloadLike | null,
        },
      },
    );

    expect(result.current).toHaveLength(1);

    rerender({ payload: invalidPayload });
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toMatchObject({
      total: 4,
      critical: 1,
      warning: 2,
    });
    expect(warnSpy).toHaveBeenCalledOnce();

    warnSpy.mockRestore();
  });

  it("keeps only the last 30 points", () => {
    const { result, rerender } = renderHook(
      ({ payload }: { payload: DashboardPayloadLike | null }) =>
        useIncidentsTrend(payload),
      {
        initialProps: {
          payload: null as DashboardPayloadLike | null,
        },
      },
    );

    for (let index = 0; index < 35; index += 1) {
      const second = String(index).padStart(2, "0");
      const timestamp = `2026-06-27T10:00:${second}.000Z`;

      rerender({
        payload: makeDashboardPayload({
          generatedAt: timestamp,
          incidents: [createIncidentAt(`inc-${index}`, timestamp)],
        }),
      });
    }

    expect(result.current).toHaveLength(30);
    expect(result.current[0]?.timestampMs).toBe(
      Date.parse("2026-06-27T10:00:05.000Z"),
    );
    expect(result.current[29]?.timestampMs).toBe(
      Date.parse("2026-06-27T10:00:34.000Z"),
    );
  });
});
