import { describe, expect, it, vi } from "vitest";

import { createCityPageUseCases } from "./get-city-read-models";
import type { CityPageRepository } from "./city-page-repository";

const identity = { citySlug: "bangkok", locale: "en-GB" };

function repository(): CityPageRepository {
  return {
    getOverview: vi.fn(),
    getAirports: vi.fn().mockResolvedValue([]),
    getDestinations: vi.fn().mockResolvedValue({ destinations: [], total: 0, facets: {} }),
    getAirlines: vi.fn().mockRejectedValue(new Error("unavailable")),
    getInsights: vi.fn().mockResolvedValue({}),
    getQuickFacts: vi.fn().mockResolvedValue({}),
    getInternalLinks: vi.fn().mockResolvedValue([]),
    getFaqs: vi.fn().mockResolvedValue([]),
  } as unknown as CityPageRepository;
}

describe("city page use cases", () => {
  it("delegates normalized identity to one repository port", async () => {
    const port = repository();
    await createCityPageUseCases(port).getAirports(identity);
    expect(port.getAirports).toHaveBeenCalledWith(identity);
    await createCityPageUseCases(port).getQuickFacts(identity);
    expect(port.getQuickFacts).toHaveBeenCalledWith(identity);
  });

  it("isolates empty and unavailable secondary read models", async () => {
    const useCases = createCityPageUseCases(repository());
    await expect(useCases.getAirports(identity)).resolves.toEqual({ status: "empty" });
    await expect(useCases.getAirlines(identity)).resolves.toEqual({ status: "unavailable" });
  });
});
