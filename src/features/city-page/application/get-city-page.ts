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
    // Never fallback in staging or production to prevent serving unverified/stale pSEO content.
    if (process.env.APP_ENV === "local" && slug === "bangkok") {
      return BANGKOK_CITY_PAGE_FIXTURE;
    }
    throw error;
  }
}
