import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CityLinksSection } from "./city-links-section";

describe("CityLinksSection", () => {
  it("projects reviewed links as alternate departure cities", () => {
    const markup = renderToStaticMarkup(
      <CityLinksSection
        cityName="Singapore"
        groups={[
          {
            cluster: "change_source_city",
            links: [
              {
                title: "Direct flights from Bangkok",
                path: "/flights-from/bangkok",
                anchorText: "Direct flights from Bangkok",
                secondaryText: "BKK",
                isFeatured: true,
              },
            ],
          },
        ]}
        variant="alternate-origins"
      />,
    );

    expect(markup).toContain("Not in ");
    expect(markup).toContain("Singapore?");
    expect(markup).toContain('href="/flights-from/bangkok"');
    expect(markup).toContain("<span>Bangkok</span>");
    expect(markup).toContain("BKK");
  });
});
