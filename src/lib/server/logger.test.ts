import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  extractServerRequestId,
  safeExtractServerError,
  sanitizeServerLogValue,
  serverLogger,
} from "./logger";

describe("serverLogger", () => {
  it("extracts requestId from headers or generates UUID", () => {
    const reqWithHeader = new Request("https://tripways.test", {
      headers: { "x-request-id": "web-req-999" },
    });
    expect(extractServerRequestId(reqWithHeader)).toBe("web-req-999");

    const reqWithoutHeader = new Request("https://tripways.test");
    const generated = extractServerRequestId(reqWithoutHeader);
    expect(generated.length).toBeGreaterThan(10);
  });

  it("sanitizes sensitive server context fields", () => {
    const context = {
      user: "user_42",
      password: "my-plain-password",
      authorization: "Bearer secret-jwt",
      apiKey: "secret-key",
      nested: {
        cookie: "session=123",
        cityName: "Bangkok",
      },
    };

    const sanitized = sanitizeServerLogValue(context) as Record<string, unknown>;
    expect(sanitized.user).toBe("user_42");
    expect(sanitized.password).toBe("[redacted]");
    expect(sanitized.authorization).toBe("[redacted]");
    expect(sanitized.apiKey).toBe("[redacted]");
    expect(sanitized.nested).toEqual({
      cookie: "[redacted]",
      cityName: "Bangkok",
    });
  });

  it("safely extracts server errors with error codes and digests", () => {
    const error = new Error("ERR_PAGE_DATA_UNAVAILABLE");
    Object.assign(error, { digest: "next-digest-123" });

    const extracted = safeExtractServerError(error);
    expect(extracted.errorCode).toBe("ERR_PAGE_DATA_UNAVAILABLE");
    expect(extracted.errorName).toBe("Error");
    expect(extracted.digest).toBe("next-digest-123");
  });

  it("executes log calls without throwing", () => {
    expect(() => {
      serverLogger.info("SSR_RENDER_SUCCESS", { path: "/flights-from/bangkok", durationMs: 45 });
      serverLogger.warn("SSR_FALLBACK_TRIGGERED", new Error("Slow upstream"), { path: "/airports/bkk" });
      serverLogger.error("SSR_UNHANDLED_EXCEPTION", new Error("ERR_INTERNAL"), { requestId: "req-1" });
    }).not.toThrow();
  });
});
