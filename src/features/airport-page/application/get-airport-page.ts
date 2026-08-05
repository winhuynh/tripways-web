import { loadPageModel } from "@/lib/server/page-data/page-client";

import { parseAirportPageResponse } from "../infrastructure/airport-page-response.dto";

export function getAirportPage(airportIata: string, locale = "en-GB") {
  return loadPageModel({ pageType: "airport", entityKey: airportIata, locale, parse: parseAirportPageResponse });
}
