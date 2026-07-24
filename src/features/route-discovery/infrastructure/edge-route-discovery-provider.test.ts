import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createEdgeRouteDiscoveryProvider } from "./edge-route-discovery-provider";

const route = {
  id: "route-1",
  from: "SGN",
  to: "SIN",
  stops: 0,
  connection_airports: [],
  operating_airlines: ["SQ"],
  total_flight_minutes: 125,
  layover_minutes: null,
  total_duration_minutes: 125,
  departure_local_time: "09:00",
  arrival_local_time: "12:05",
  arrival_day_offset: 0,
  valid_from: "2026-01-01",
  valid_to: "2026-12-31",
  days_of_week: [1],
  confidence_score: 0.95,
  data_version: "fixture-v1",
};

describe("EdgeRouteDiscoveryProvider", () => {
  it("posts the action contract and maps the public response", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({
        status: "success",
        data: {
          routes: [route],
          pagination: { total: 1, limit: 20, offset: 0 },
          facets: {
            stops: [{ value: 0, count: 1 }],
            airlines: [{ value: "SQ", count: 1 }],
          },
        },
        error: null,
      })),
    );
    const provider = createEdgeRouteDiscoveryProvider(
      { supabaseUrl: "http://127.0.0.1:55321", supabaseAnonKey: "anon-key" },
      fetchImpl,
    );

    await expect(provider.searchRoutes({ from: "SGN", to: "SIN" })).resolves
      .toMatchObject({ routes: [route], pagination: { total: 1 } });
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://127.0.0.1:55321/functions/v1/route-discovery-query",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          action: "search_routes",
          input: { from: "SGN", to: "SIN" },
        }),
      }),
    );
  });

  it("rejects malformed payloads as contract violations", async () => {
    const provider = createEdgeRouteDiscoveryProvider(
      { supabaseUrl: "http://127.0.0.1:55321", supabaseAnonKey: "anon-key" },
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ status: "success", data: {}, error: null })),
      ),
    );
    await expect(provider.searchRoutes({ from: "SGN", to: "SIN" })).rejects
      .toMatchObject({ code: "ERR_ROUTE_DISCOVERY_CONTRACT" });
  });
});
