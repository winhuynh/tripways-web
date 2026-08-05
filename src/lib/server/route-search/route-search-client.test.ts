import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { searchRouteData } from "./route-search-client";

beforeEach(() => {
  process.env.SUPABASE_URL = "http://local";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.PAGE_DATA_VERSION = "test-v1";
});

describe("searchRouteData", () => {
  it("posts one canonical route-search request", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ data: [], meta: { total: 0 }, error: null }),
        { status: 200 },
      ),
    );

    const result = await searchRouteData({
      request: {
        scope: { type: "airport", key: "BKK", direction: "from" },
        filters: { route_type: "international" },
        page_size: 20,
        after: null,
      },
      parse: (value) => (value as { meta: { total: number } }).meta.total,
      fetchImpl,
    });

    expect(result).toBe(0);
    expect(JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body))).toEqual({
      scope: { type: "airport", key: "BKK", direction: "from" },
      filters: { route_type: "international" },
      page_size: 20,
      after: null,
    });
  });
});
