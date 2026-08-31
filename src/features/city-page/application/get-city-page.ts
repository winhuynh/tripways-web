import { loadPageModel } from "@/lib/server/page-data/page-client";
import { BANGKOK_CITY_PAGE_FIXTURE } from "../domain/city-page-fixture";
import type { CityPageModel } from "../domain/city-page-model";
import { parseCityPageResponse } from "../infrastructure/city-page-response.dto";

export async function getCityPage(
  slug: string,
  locale = "en-GB",
): Promise<CityPageModel> {
  try {
    return await loadPageModel({
      pageType: "city",
      entityKey: slug,
      locale,
      parse: parseCityPageResponse,
    });
  } catch (error) {
    // Strictly isolate preview fixture fallback to local offline dev only.
    if (
      process.env.NODE_ENV === "development" ||
      process.env.APP_ENV === "local"
    ) {
      const cityName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return {
        ...BANGKOK_CITY_PAGE_FIXTURE,
        city: { ...BANGKOK_CITY_PAGE_FIXTURE.city, slug, name: cityName },
        canonicalPath: `/flights-from/${slug}`,
      };
    }
    throw error;
  }
}
