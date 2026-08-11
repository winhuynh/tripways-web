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
            city_count: 3,
            airport_count: 4,
            direct_route_count: 8,
            data_version: "a5247124-be06-4f38-87e3-b4369d8d8c71",
            generated_at: "2026-08-11T00:00:00Z",
          },
          meta: {},
          error: null,
        }),
        { status: 200 },
      ),
    );

    const model = await getHomepageStatistics(fetchImpl);

    expect(model.directRouteCount).toBe(8);
    expect(fetchImpl.mock.calls[0]?.[0]).toBe(
      "http://local/rest/v1/rpc/rpc_get_homepage_statistics",
    );
    expect(JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body))).toEqual({});
  });
});
