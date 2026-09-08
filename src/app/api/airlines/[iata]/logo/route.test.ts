import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /api/airlines/[iata]/logo", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("proxies upstream PNG and sets strong Cloudflare edge cache headers", async () => {
    const fakeBuffer = new Uint8Array([137, 80, 78, 71]).buffer;

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(fakeBuffer, {
        status: 200,
        headers: { "Content-Type": "image/png" },
      })
    );

    const req = new Request("https://tripways.io/api/airlines/VN/logo");
    const res = await GET(req, {
      params: Promise.resolve({ iata: "VN" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect(res.headers.get("cache-control")).toContain("s-maxage=31536000");
    expect(res.headers.get("cache-control")).toContain("immutable");
    expect(res.headers.get("cloudflare-cdn-cache-control")).toBe("max-age=31536000");
  });

  it("returns fallback SVG when upstream returns 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("Not found", { status: 404 })
    );

    const req = new Request("https://tripways.io/api/airlines/XX/logo");
    const res = await GET(req, {
      params: Promise.resolve({ iata: "XX" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/svg+xml");
    const bodyText = await res.text();
    expect(bodyText).toContain("<svg");
    expect(bodyText).toContain("XX");
  });

  it("returns fallback SVG immediately when IATA is invalid", async () => {
    const req = new Request("https://tripways.io/api/airlines/INVALID/logo");
    const res = await GET(req, {
      params: Promise.resolve({ iata: "INVALID" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/svg+xml");
    const bodyText = await res.text();
    expect(bodyText).toContain("<svg");
  });
});
