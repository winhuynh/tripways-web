import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { readPageDataEnvironment } from "./page-data-environment";

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("readPageDataEnvironment", () => {
  it("uses the shared page-query function for city and airport reads", () => {
    process.env = {
      ...originalEnvironment,
      SUPABASE_URL: "http://127.0.0.1:55321/",
      SUPABASE_ANON_KEY: "local-anon",
      PAGE_DATA_VERSION: "local-v1",
    };
    delete process.env.CITY_PAGE_EDGE_URL;
    delete process.env.AIRPORT_PAGE_EDGE_URL;

    const environment = readPageDataEnvironment();

    expect(environment.cityPageEdgeUrl).toBe(
      "http://127.0.0.1:55321/functions/v1/page-query",
    );
    expect(environment.airportPageEdgeUrl).toBe(
      "http://127.0.0.1:55321/functions/v1/page-query",
    );
  });
});
