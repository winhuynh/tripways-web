import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  parseRouteSearchEnvelope,
  RouteDiscoveryError,
  searchRoutes,
} from "./route-discovery";

const validEnvelope = {
  data: [
    {
      id: "4e66875a-57ad-4771-b5ed-31f04daacb2f",
      from: "SGN",
      to: "LHR",
      stops: 0,
      connection_airports: [],
      operating_airlines: ["VN"],
      total_flight_minutes: 840,
      layover_minutes: null,
      total_duration_minutes: 840,
      departure_local_time: "09:00",
      arrival_local_time: "16:00",
      arrival_day_offset: 0,
      valid_from: "2026-01-01",
      valid_to: "2026-12-31",
      days_of_week: [1, 3, 5],
      confidence_score: 0.95,
      data_version: "3c2de933-ad52-4c79-8dea-bb4e1f613bb6",
    },
  ],
  meta: {
    total: 1,
    limit: 20,
    offset: 0,
    facets: {
      stops: [{ value: 0, count: 1 }],
      airlines: [{ value: "VN", count: 1 }],
    },
  },
  error: null,
};

describe("parseRouteSearchEnvelope", () => {
  it("accepts the stable route-search envelope", () => {
    expect(parseRouteSearchEnvelope(validEnvelope)).toEqual(validEnvelope);
  });

  it("keeps a stable RPC error", () => {
    expect(
      parseRouteSearchEnvelope({
        data: [],
        meta: {},
        error: { code: "ERR_AIRPORT_NOT_FOUND", message: "Airport was not found." },
      }).error,
    ).toEqual({ code: "ERR_AIRPORT_NOT_FOUND", message: "Airport was not found." });
  });

  it("rejects a malformed payload", () => {
    expect(() => parseRouteSearchEnvelope({ data: "not-an-array" })).toThrow(
      RouteDiscoveryError,
    );
  });
});

describe("searchRoutes", () => {
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.SUPABASE_URL = originalUrl;
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });

  it("fails safely when server environment is missing", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    await expect(searchRoutes({ from: "SGN", to: "LHR" })).rejects.toMatchObject({
      code: "ERR_ROUTE_DISCOVERY_SETUP",
    });
  });

  it("posts the input to the RPC with server-only authorization", async () => {
    process.env.SUPABASE_URL = "http://127.0.0.1:55321";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "local-secret";
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(validEnvelope), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(
      searchRoutes({ from: "SGN", to: "LHR", max_stops: 1 }, fetchImpl),
    ).resolves.toEqual(validEnvelope);
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://127.0.0.1:55321/rest/v1/rpc/rpc_search_routes",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          apikey: "local-secret",
          authorization: "Bearer local-secret",
        }),
        body: JSON.stringify({ p_input: { from: "SGN", to: "LHR", max_stops: 1 } }),
      }),
    );
  });
});
