import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getHomepageStatistics } from "./get-homepage";

beforeEach(() => {
  process.env.SUPABASE_URL = "http://local";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.PAGE_DATA_VERSION = "test-v1";
});

describe("getHomepageStatistics", () => {
  it("loads the bounded statistics endpoint without a page-model request", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            origin_city_count: 3,
            origin_airport_count: 4,
            published_direct_route_count: 8,
          },
          meta: {
            data_version: "v_0123456789abcdef0123456789abcdef",
            generated_at: "2026-08-11T00:00:00Z",
          },
          error: null,
        }),
        { status: 200 },
      ),
    );

    const model = await getHomepageStatistics(fetchImpl);

    expect(model.publishedDirectRouteCount).toBe(8);
    expect(fetchImpl.mock.calls[0]?.[0]).toBe(
      "http://local/functions/v1/homepage-statistics",
    );
    expect(JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body))).toEqual({});
  });
});
