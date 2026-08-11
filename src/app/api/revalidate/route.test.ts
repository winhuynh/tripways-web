import { afterEach, describe, expect, it, vi } from "vitest";

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }));

vi.mock("next/cache", () => ({ revalidateTag }));

import { POST } from "./route";

const originalSecret = process.env.REVALIDATE_SECRET;

afterEach(() => {
  process.env.REVALIDATE_SECRET = originalSecret;
  revalidateTag.mockReset();
});

describe("POST /api/revalidate", () => {
  it("marks an authorized cache tag stale with the max profile", async () => {
    process.env.REVALIDATE_SECRET = "test-secret";
    const request = new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tag: "page:city:bangkok:en-GB", secret: "test-secret" }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("page:city:bangkok:en-GB", "max");
  });
});
