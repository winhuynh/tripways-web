import { describe, expect, it, vi } from "vitest";

import { createEdgeRouteMapRepository } from "./edge-route-map-repository";

describe("createEdgeRouteMapRepository", () => {
  it("posts the city route-map action and maps the response", async () => {
    let capturedInit: RequestInit | undefined;
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        capturedInit = init;
        return new Response(
        JSON.stringify({
          data: {
            origin: {
              type: "city",
              name: "Bangkok",
              slug: "bangkok",
              latitude: 13.7563,
              longitude: 100.5018,
            },
            destinations: [],
          },
          meta: {
            data_version: "v1",
            total: 0,
            omitted_destination_count: 0,
            limit: 100,
          },
          error: null,
        }),
        { status: 200 },
        );
      },
    );
    const repository = createEdgeRouteMapRepository(
      {
        cityPageEdgeUrl: "http://localhost:8000",
        supabasePublishableKey: "publishable-key",
      },
      fetchImpl as typeof fetch,
    );

    await repository.getCityRouteMap({
      origin: { type: "city", slug: "bangkok" },
      locale: "en-GB",
      originAirports: ["BKK"],
      limit: 100,
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(JSON.parse(String(capturedInit?.body))).toEqual({
      action: "get_route_map",
      input: {
        city_slug: "bangkok",
        locale: "en-GB",
        origin_airports: ["BKK"],
        limit: 100,
      },
    });
  });
});
