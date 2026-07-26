import { describe, expect, it, vi } from "vitest";

import type { RouteMapRepository } from "./route-map-repository";
import { createGetRouteMap } from "./get-route-map";
import type { RouteMapReadModel } from "../domain/route-map-model";

const readModel: RouteMapReadModel = {
  origin: {
    type: "city",
    name: "Bangkok",
    slug: "bangkok",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  destinations: [],
  meta: {
    dataVersion: "v1",
    total: 0,
    omittedDestinationCount: 0,
    limit: 100,
  },
};

describe("createGetRouteMap", () => {
  it("loads city origins through the repository", async () => {
    const getCityRouteMap = vi.fn(async () => readModel);
    const repository: RouteMapRepository = { getCityRouteMap };
    const getRouteMap = createGetRouteMap(repository);

    await expect(
      getRouteMap({
        origin: { type: "city", slug: "bangkok" },
        locale: "en-GB",
        originAirports: ["BKK"],
        limit: 100,
      }),
    ).resolves.toEqual({ status: "available", data: readModel });
    expect(getCityRouteMap).toHaveBeenCalledWith({
      origin: { type: "city", slug: "bangkok" },
      locale: "en-GB",
      originAirports: ["BKK"],
      limit: 100,
    });
  });

  it("rejects airport origins before transport support exists", async () => {
    const getCityRouteMap = vi.fn(async () => readModel);
    const getRouteMap = createGetRouteMap({ getCityRouteMap });

    await expect(
      getRouteMap({
        origin: { type: "airport", iata: "BKK" },
        locale: "en-GB",
      }),
    ).resolves.toEqual({
      status: "unavailable",
      reason: "unsupported_origin",
    });
    expect(getCityRouteMap).not.toHaveBeenCalled();
  });

  it("isolates repository failures as an unavailable read model", async () => {
    const getRouteMap = createGetRouteMap({
      getCityRouteMap: async () => {
        throw new Error("transport failed");
      },
    });

    await expect(
      getRouteMap({
        origin: { type: "city", slug: "bangkok" },
        locale: "en-GB",
      }),
    ).resolves.toEqual({ status: "unavailable", reason: "read_failed" });
  });
});
