import { afterEach, describe, expect, it } from "vitest";

import { readApplicationEnvironment } from "./application-environment";

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("readApplicationEnvironment", () => {
  it.each([
    ["local", "http://localhost:3000"],
    ["staging", "https://staging.tripways.app"],
    ["production", "https://tripways.app"],
  ] as const)("accepts the canonical %s site URL", (appEnvironment, siteUrl) => {
    process.env.APP_ENV = appEnvironment;
    process.env.NEXT_PUBLIC_SITE_URL = siteUrl;

    expect(readApplicationEnvironment()).toEqual({
      appEnvironment,
      siteUrl,
    });
  });

  it("rejects a staging build configured with the production site URL", () => {
    process.env.APP_ENV = "staging";
    process.env.NEXT_PUBLIC_SITE_URL = "https://tripways.app";

    expect(() => readApplicationEnvironment()).toThrow(
      "ERR_APPLICATION_ENVIRONMENT_SETUP",
    );
  });

  it("rejects an unsupported application environment", () => {
    process.env.APP_ENV = "preview";
    process.env.NEXT_PUBLIC_SITE_URL = "https://preview.tripways.app";

    expect(() => readApplicationEnvironment()).toThrow(
      "ERR_APPLICATION_ENVIRONMENT_SETUP",
    );
  });
});
