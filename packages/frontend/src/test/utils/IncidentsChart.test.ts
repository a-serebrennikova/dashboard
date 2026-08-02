import { describe, expect, it } from "vitest";
import { buildIncidentsChartData } from "../../modules/dashboard/dynamic/utils/buildIncidentsChartData";

describe("buildIncidentsChartData", () => {
  it("keeps a numeric x value and a readable name for each trend point", () => {
    const trend = [
      {
        second: "00:00:00",
        timestampMs: 1,
        x: 0,
        total: 8,
        critical: 3,
        warning: 2,
      },
      {
        second: "00:00:01",
        timestampMs: 2,
        x: 1,
        total: 10,
        critical: 4,
        warning: 3,
      },
    ];

    expect(buildIncidentsChartData(trend)).toEqual([
      {
        name: "00:00:00",
        x: 0,
        critical: 3,
        warning: 2,
        other: 3,
        total: 8,
      },
      {
        name: "00:00:01",
        x: 1,
        critical: 4,
        warning: 3,
        other: 3,
        total: 10,
      },
    ]);
  });
});
