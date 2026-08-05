import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { loadPageModel } from "./page-client";

beforeEach(() => {
  process.env.SUPABASE_URL = "http://local";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.PAGE_DATA_VERSION = "test-v1";
});

describe("loadPageModel", () => {
  it("posts the canonical page request and parses the page payload", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { page: { h1: "Direct flights from Bangkok" } },
          meta: { page_type: "city", entity_key: "bangkok" },
          error: null,
        }),
        { status: 200 },
      ),
    );

    const model = await loadPageModel({
      pageType: "city",
      entityKey: "bangkok",
      locale: "en-GB",
      parse: (value) => (value as { page: { h1: string } }).page.h1,
      fetchImpl,
    });

    expect(model).toBe("Direct flights from Bangkok");
    expect(JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body))).toEqual({
      action: "get_page",
      input: { page_type: "city", entity_key: "bangkok", locale: "en-GB" },
    });
  });

  it("preserves stable page-not-found errors", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({ data: null, error: { code: "ERR_PAGE_NOT_FOUND" } }),
        { status: 404 },
      ),
    );

    await expect(
      loadPageModel({
        pageType: "airport",
        entityKey: "ZZZ",
        locale: "en-GB",
        parse: () => "unreachable",
        fetchImpl,
      }),
    ).rejects.toThrow("ERR_PAGE_NOT_FOUND");
  });
});
