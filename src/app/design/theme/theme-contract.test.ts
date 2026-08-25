import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const DESIGN_ROOT = new URL("../", import.meta.url);

function readDesignFile(relativePath: string): string {
  const fileUrl = new URL(relativePath, DESIGN_ROOT);
  expect(existsSync(fileUrl)).toBe(true);
  return readFileSync(fileUrl, "utf8");
}

describe("modern travel design theme", () => {
  it("preserves the approved primitive color foundations", () => {
    const colors = readDesignFile("tokens/colors.css");

    expect(colors).toContain("--palette-primary-500: #0066ff;");
    expect(colors).toContain("--palette-neutral-50: #f8fafc;");
    expect(colors).toContain("--palette-accent-500: #f97316;");
  });

  it("defines the approved headline, body, and label typography roles", () => {
    const typography = readDesignFile("tokens/typography.css");

    expect(typography).toContain("--font-headline: system-ui");
    expect(typography).toContain("--font-body: system-ui");
    expect(typography).toContain("--font-label: system-ui");
  });

  it("maps primitives to semantic roles and keeps narrow legacy aliases", () => {
    const theme = readDesignFile("theme/theme.css");

    expect(theme).toContain("--color-primary: var(--palette-primary-500);");
    expect(theme).toContain("--color-background: var(--palette-neutral-50);");
    expect(theme).toContain("--color-accent: var(--palette-accent-500);");
    expect(theme).toContain("--blue: var(--color-primary);");
    expect(theme).toContain("--navy: var(--color-on-background);");
  });

  it("uses network-independent system fonts and semantic globals", () => {
    const layout = readFileSync(
      new URL("../../layout.tsx", import.meta.url),
      "utf8",
    );
    const globals = readFileSync(
      new URL("../../globals.css", import.meta.url),
      "utf8",
    );

    expect(layout).not.toContain("next/font/google");
    expect(layout).toContain('<html lang="en">');
    expect(globals).toContain('@import "./design/index.css";');
    expect(globals).toContain("background: var(--color-background);");
    expect(globals).toContain("font-family: var(--type-body-family);");
  });
});
