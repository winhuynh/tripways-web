import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { readPageDataEnvironment } from "./page-data-environment";

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("readPageDataEnvironment", () => {
  it("uses canonical page, route-search, and homepage-statistics endpoints", () => {
    process.env = {
      ...originalEnvironment,
      SUPABASE_URL: "http://127.0.0.1:55321/",
      SUPABASE_ANON_KEY: "local-anon",
      PAGE_DATA_VERSION: "local-v1",
    };
    delete process.env.PAGE_QUERY_EDGE_URL;
    delete process.env.ROUTE_SEARCH_QUERY_EDGE_URL;
    delete process.env.HOMEPAGE_STATISTICS_EDGE_URL;

    const environment = readPageDataEnvironment();

    expect(environment.pageQueryUrl).toBe(
      "http://127.0.0.1:55321/functions/v1/page-query",
    );
    expect(environment.routeSearchQueryUrl).toBe(
      "http://127.0.0.1:55321/functions/v1/route-search-query",
    );
    expect(environment.homepageStatisticsUrl).toBe(
      "http://127.0.0.1:55321/rest/v1/rpc/rpc_get_homepage_statistics",
    );
  });
});
