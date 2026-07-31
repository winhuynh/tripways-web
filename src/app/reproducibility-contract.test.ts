import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

describe("local release candidate reproducibility", () => {
  it("does not fetch Google fonts during production build", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).not.toContain("next/font/google");
    expect(layout).not.toContain("fonts.googleapis.com");
  });

  it("documents every server-side page transport variable without secrets", () => {
    const example = read(".env.example");
    for (const name of [
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "PAGE_DATA_VERSION",
      "PAGE_DATA_TIMEOUT_MS",
      "CITY_PAGE_EDGE_URL",
      "AIRPORT_PAGE_EDGE_URL",
      "NEXT_PUBLIC_SITE_URL",
    ]) {
      expect(example).toContain(`${name}=`);
    }
    expect(example).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("provides one deterministic local verification command", () => {
    const packageJson = JSON.parse(read("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(packageJson.scripts["verify:p0a"]).toContain("npm run build");
    expect(packageJson.scripts["verify:p0a"]).toContain("npm run test");
  });
});
