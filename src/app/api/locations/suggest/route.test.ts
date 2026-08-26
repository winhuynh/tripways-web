import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/locations/suggest", () => {
  it("returns quick actions on empty query", async () => {
    const req = new Request("https://tripways.io/api/locations/suggest");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
    expect(body.data[0].title).toBe("Explore everywhere");
  });

  it("returns nearby airports when origin is London (LHR)", async () => {
    const req = new Request("https://tripways.io/api/locations/suggest?origin=LHR");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.length).toBeGreaterThanOrEqual(2);
    expect(body.data[0].iata).toBe("LHR");
    expect(body.data.some((item: { iata: string }) => item.iata === "LGW")).toBe(true);
  });

  it("returns matching suggestions when query is 'ku'", async () => {
    const req = new Request("https://tripways.io/api/locations/suggest?q=ku");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    const titles = body.data.map((item: { title: string }) => item.title);
    expect(titles.some((t: string) => t.includes("Kuala Lumpur"))).toBe(true);
    expect(titles.some((t: string) => t.includes("Kutaisi"))).toBe(true);
  });
});
