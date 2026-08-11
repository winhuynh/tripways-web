import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  buildPageDataCacheIdentity,
  requestPageData,
} from "./page-data-transport";

describe("shared page-data transport", () => {
  it("builds cache identity from locale, entity, filters, and data version", () => {
    expect(
      buildPageDataCacheIdentity({
        locale: "en-GB",
        entityIdentity: "city:bangkok",
        filters: { airline: ["SQ"], offset: 0 },
        dataVersion: "v2",
      }),
    ).toBe(
      'page-data:v2:en-GB:city:bangkok:{"airline":["SQ"],"offset":0}',
    );
  });

  it("maps not-found envelopes through the domain error factory", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ data: null, error: { code: "ERR_AIRPORT_NOT_FOUND" } }),
        { status: 404 },
      ),
    );

    await expect(
      requestPageData({
        url: "http://local/airport",
        anonKey: "anon",
        body: { action: "get_page", input: {} },
        cacheIdentity: "airport:bkk",
        timeoutMs: 100,
        notFoundCodes: ["ERR_AIRPORT_NOT_FOUND"],
        unavailableCode: "ERR_AIRPORT_PAGE_UNAVAILABLE",
        createError: (code) => new Error(code),
        parse: (value) => value,
        fetchImpl,
      }),
    ).rejects.toThrow("ERR_AIRPORT_NOT_FOUND");
  });

  it("maps malformed JSON and timeouts to a stable dependency error", async () => {
    const malformedFetch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response("{", { status: 200 }),
    );
    await expect(
      requestPageData({
        url: "http://local/city",
        anonKey: "anon",
        body: {},
        cacheIdentity: "city:bangkok",
        timeoutMs: 100,
        notFoundCodes: [],
        unavailableCode: "ERR_CITY_PAGE_UNAVAILABLE",
        createError: (code) => new Error(code),
        parse: (value) => value,
        fetchImpl: malformedFetch,
      }),
    ).rejects.toThrow("ERR_CITY_PAGE_UNAVAILABLE");
  });

  it("bypasses the Next data cache in local development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { slug: "bangkok" }, error: null }), {
        status: 200,
      }),
    );

    await requestPageData({
      url: "http://local/city",
      anonKey: "anon",
      body: {},
      cacheIdentity: "city:bangkok",
      timeoutMs: 100,
      notFoundCodes: [],
      unavailableCode: "ERR_CITY_PAGE_UNAVAILABLE",
      createError: (code) => new Error(code),
      parse: (value) => value,
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://local/city",
      expect.objectContaining({ cache: "no-store" }),
    );
    vi.unstubAllEnvs();
  });
});
