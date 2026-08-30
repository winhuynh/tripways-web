import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import GlobalError from "./global-error";

describe("global error boundary", () => {
  it("renders safe recovery UI for root crashes without leaking stack traces", () => {
    const error = new Error("CRITICAL_ROOT_LAYOUT_FAILURE");
    const html = renderToStaticMarkup(<GlobalError error={error} reset={vi.fn()} />);

    expect(html).toContain("Something went wrong");
    expect(html).toContain("Try again");
    expect(html).not.toContain("CRITICAL_ROOT_LAYOUT_FAILURE");
  });
});
