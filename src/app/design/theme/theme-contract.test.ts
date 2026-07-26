import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const DESIGN_ROOT = new URL("../", import.meta.url);

function readDesignFile(relativePath: string): string {
  const fileUrl = new URL(relativePath, DESIGN_ROOT);
  expect(existsSync(fileUrl)).toBe(true);
  return readFileSync(fileUrl, "utf8");
}

describe("editorial design theme", () => {
  it("preserves the approved primitive color foundations", () => {
    const colors = readDesignFile("tokens/colors.css");

    expect(colors).toContain("--palette-primary-500: #137fec;");
    expect(colors).toContain("--palette-secondary-500: #5f5e5e;");
    expect(colors).toContain("--palette-tertiary-500: #ce6000;");
    expect(colors).toContain("--palette-neutral-50: #fdf9f2;");
  });

  it("defines the approved headline, body, and label typography roles", () => {
    const typography = readDesignFile("tokens/typography.css");

    expect(typography).toContain("--font-headline: var(--font-playfair-display)");
    expect(typography).toContain("--font-body: var(--font-merriweather)");
    expect(typography).toContain("--font-label: var(--font-inter)");
  });

  it("maps primitives to semantic roles and keeps narrow legacy aliases", () => {
    const theme = readDesignFile("theme/theme.css");

    expect(theme).toContain("--color-primary: var(--palette-primary-500);");
    expect(theme).toContain("--color-background: var(--palette-neutral-50);");
    expect(theme).toContain("--color-accent: var(--palette-tertiary-500);");
    expect(theme).toContain("--blue: var(--color-primary);");
    expect(theme).toContain("--navy: var(--color-on-background);");
  });

  it("wires self-hosted font variables and semantic globals into the app", () => {
    const layout = readFileSync(
      new URL("../../layout.tsx", import.meta.url),
      "utf8",
    );
    const globals = readFileSync(
      new URL("../../globals.css", import.meta.url),
      "utf8",
    );

    expect(layout).toContain("Playfair_Display");
    expect(layout).toContain("Merriweather");
    expect(layout).toContain('variable: "--font-playfair-display"');
    expect(layout).toContain('variable: "--font-merriweather"');
    expect(layout).toContain('variable: "--font-inter"');
    expect(globals).toContain('@import "./design/index.css";');
    expect(globals).toContain("background: var(--color-background);");
    expect(globals).toContain("font-family: var(--type-body-family);");
  });
});
