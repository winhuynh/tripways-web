import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

function collectText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join(" ");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return collectText(node.props.children);
  }

  return "";
}

describe("HomePage", () => {
  it("links the local city-page draft", () => {
    const text = collectText(HomePage());

    expect(text).toContain("Tripways");
    expect(text).toContain("City direct-flight discovery");
    expect(text).toContain("View Bangkok draft");
  });
});
