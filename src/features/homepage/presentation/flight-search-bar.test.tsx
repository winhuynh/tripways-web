import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { FlightSearchBar } from "./flight-search-bar";
import { LocationSuggestDropdown } from "./location-suggest-dropdown";
import type { LocationSuggestionItem } from "../domain/location-suggest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("FlightSearchBar", () => {
  it("renders with clean From and To inputs, Direct only, and Multi-city options", () => {
    const html = renderToStaticMarkup(<FlightSearchBar />);
    expect(html).toContain("From");
    expect(html).toContain("To");
    expect(html).toContain("Country, city or airport...");
    expect(html).toContain("Search flights");
    expect(html).toContain("Direct flights only");
    expect(html).toContain("Flight search");
    expect(html).toContain("Multi-city search");

    // Ensure removed fields are not present
    expect(html).not.toContain("Depart");
    expect(html).not.toContain("Return");
    expect(html).not.toContain("Travelers and cabin class");
    expect(html).not.toContain("Cabin bag & checked bag");
    expect(html).not.toContain("Add accommodation");
  });
});

describe("LocationSuggestDropdown", () => {
  it("renders nearby airport items with distance formatted in English", () => {
    const items: LocationSuggestionItem[] = [
      {
        id: "airport-LHR",
        type: "airport",
        title: "Heathrow Airport (LHR)",
        subtitle: "United Kingdom",
        iata: "LHR",
        cityName: "London",
        countryName: "United Kingdom",
      },
      {
        id: "airport-LGW",
        type: "airport",
        title: "Gatwick Airport (LGW)",
        subtitle: "40 km from London, United Kingdom",
        iata: "LGW",
        cityName: "London",
        countryName: "United Kingdom",
        distanceKm: 40,
      },
    ];

    const html = renderToStaticMarkup(
      <LocationSuggestDropdown
        items={items}
        query=""
        onSelect={vi.fn()}
      />,
    );

    expect(html).toContain("Heathrow Airport (LHR)");
    expect(html).toContain("United Kingdom");
    expect(html).toContain("Gatwick Airport (LGW)");
    expect(html).toContain("40 km from London, United Kingdom");
  });

  it("renders English quick action items for empty destination query", () => {
    const items: LocationSuggestionItem[] = [
      {
        id: "action-explore-everywhere",
        type: "action",
        title: "Explore everywhere",
        subtitle: "",
        cityName: "",
        countryName: "",
        actionType: "everywhere",
      },
      {
        id: "action-multi-city",
        type: "action",
        title: "Multi-city search",
        subtitle: "",
        cityName: "",
        countryName: "",
        actionType: "multicity",
      },
    ];

    const html = renderToStaticMarkup(
      <LocationSuggestDropdown
        items={items}
        query=""
        onSelect={vi.fn()}
      />,
    );

    expect(html).toContain("Explore everywhere");
    expect(html).toContain("Multi-city search");
  });

  it("highlights matching prefix when query is 'Ku'", () => {
    const items: LocationSuggestionItem[] = [
      {
        id: "city-kuala-lumpur",
        type: "city",
        title: "Kuala Lumpur (Any)",
        subtitle: "Malaysia",
        iata: "KUL",
        cityName: "Kuala Lumpur",
        countryName: "Malaysia",
      },
    ];

    const html = renderToStaticMarkup(
      <LocationSuggestDropdown
        items={items}
        query="Ku"
        onSelect={vi.fn()}
      />,
    );

    expect(html).toContain('<strong class="suggest-highlight">Ku</strong>ala Lumpur (Any)');
  });
});
