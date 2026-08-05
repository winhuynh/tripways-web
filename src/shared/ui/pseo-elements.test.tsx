import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  Breadcrumbs,
  FaqAccordion,
  InternalLinkGroups,
  PageHero,
  StatGrid,
} from ".";

describe("shared pSEO elements", () => {
  it("renders semantic page hierarchy and reusable facts", () => {
    const markup = renderToStaticMarkup(
      <>
        <Breadcrumbs items={[{ label: "Cities", href: "/" }, { label: "Bangkok" }]} />
        <PageHero eyebrow="City hub" title="Direct flights from Bangkok" intro="Explore routes." />
        <StatGrid items={[{ label: "Destinations", value: "182" }]} />
      </>,
    );

    expect(markup).toContain("<nav");
    expect(markup).toContain("<h1>Direct flights from Bangkok</h1>");
    expect(markup).toContain("182");
    expect(markup).toContain("Destinations");
  });

  it("renders accessible native FAQ disclosure and grouped links", () => {
    const markup = renderToStaticMarkup(
      <>
        <FaqAccordion items={[{ question: "Which airport?", answer: "BKK and DMK." }]} />
        <InternalLinkGroups
          groups={[{ title: "Airport hubs", links: [{ label: "BKK Airport", href: "/airports/bkk" }] }]}
        />
      </>,
    );

    expect(markup).toContain("<details");
    expect(markup).toContain("<summary>Which airport?</summary>");
    expect(markup).toContain('href="/airports/bkk"');
  });
});
