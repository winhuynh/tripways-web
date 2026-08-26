import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  Breadcrumbs,
  FactBadgesBar,
  FaqAccordion,
  FlightOptionCard,
  InternalLinkGroups,
  PageHero,
  PracticalPlanningGrid,
  RecommendationHighlights,
  SponsoredTravelServices,
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

  it("renders FactBadgesBar with icon badges and verified date", () => {
    const markup = renderToStaticMarkup(
      <FactBadgesBar
        items={[
          { icon: "plane", label: "Nonstop available" },
          { icon: "clock", label: "12h 45m typical" },
        ]}
        verifiedDate="15 August 2026"
      />,
    );

    expect(markup).toContain("Nonstop available");
    expect(markup).toContain("12h 45m typical");
    expect(markup).toContain("Data verified 15 August 2026");
  });

  it("renders SponsoredTravelServices with disclosure and affiliate link attributes", () => {
    const markup = renderToStaticMarkup(
      <SponsoredTravelServices
        offers={[
          { type: "flights", title: "Search flights", href: "https://example.com/flights" },
          { type: "hotels", title: "Hotels", href: "https://example.com/hotels" },
        ]}
        destinationCity="London"
        routeLabel="Bangkok - London"
      />,
    );

    expect(markup).toContain("Sponsored Travel Services");
    expect(markup).toContain("Affiliate links");
    expect(markup).toContain('rel="sponsored nofollow"');
    expect(markup).toContain("London Hotels");
    expect(markup).toContain("Bangkok - London");
  });

  it("renders FlightOptionCard with origin, destination, path, and fare", () => {
    const markup = renderToStaticMarkup(
      <FlightOptionCard
        option={{
          id: "card-1",
          from: "BKK",
          fromAirportName: "Suvarnabhumi",
          to: "LHR",
          toAirportName: "Heathrow",
          stops: 0,
          durationMinutes: 765,
          airlines: ["TG"],
          frequencyWeekly: 14,
          price: { amount: 850, currency: "GBP", cabin: "Economy" },
          routePath: "/flights/bangkok-to-london",
        }}
      />,
    );

    expect(markup).toContain("BKK");
    expect(markup).toContain("Suvarnabhumi");
    expect(markup).toContain("LHR");
    expect(markup).toContain("Heathrow");
    expect(markup).toContain("NONSTOP");
    expect(markup).toContain("12h 45m");
    expect(markup).toContain("14 WEEKLY FLIGHTS");
    expect(markup).toContain("Thai Airways");
    expect(markup).toContain("View BKK → LHR");
  });

  it("renders RecommendationHighlights and PracticalPlanningGrid", () => {
    const markup = renderToStaticMarkup(
      <>
        <RecommendationHighlights
          items={[
            { badge: "FASTEST OPTION", variant: "fastest", title: "12h 45m direct" },
            { badge: "LOWEST FARE", variant: "lowest", title: "£380 one-stop" },
          ]}
        />
        <PracticalPlanningGrid
          title="Plan your journey"
          sections={[{ heading: "Departing Bangkok", body: "Allow 3 hours." }]}
          facts={[{ title: "Time zone", body: "London is behind Bangkok.", sourceUrl: "https://gov.uk" }]}
        />
      </>,
    );

    expect(markup).toContain("FASTEST OPTION");
    expect(markup).toContain("LOWEST FARE");
    expect(markup).toContain("Plan your journey");
    expect(markup).toContain("Departing Bangkok");
    expect(markup).toContain("Allow 3 hours.");
    expect(markup).toContain("Official source →");
  });
});
