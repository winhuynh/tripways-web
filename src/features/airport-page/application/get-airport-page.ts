import { loadPageModel } from "@/lib/server/page-data/page-client";

import type { AirportPageModel } from "../domain/airport-page-model";
import { parseAirportPageResponse } from "../infrastructure/airport-page-response.dto";

const DEV_AIRPORT_MOCK: AirportPageModel = {
  airport: { iata: "SGN", name: "Tan Son Nhat International Airport", city: { name: "Ho Chi Minh City", slug: "ho-chi-minh-city" }, country: { name: "Vietnam", slug: "vietnam" } },
  seo: { h1: "Tan Son Nhat International Airport (SGN) Guide", subheadline: "Vietnam's busiest aviation hub", title: "SGN Airport Guide", description: "Guide to Tan Son Nhat Airport" },
  orientation: { intro: "Welcome to Tan Son Nhat Airport.", summary: "Main gateway to southern Vietnam.", cityDistanceKm: 8, terminalCount: 2 },
  quickAnswers: { defaultTransport: "Airport Bus 109 / Taxi", transportMinutes: { min: 30, max: 60 }, cityDistanceKm: 8, terminalCount: 2 },
  arrival: { summary: "Arrival guidance for domestic and international passengers.", steps: [{ audience: "all", title: "Arrival & Baggage", body: "Follow arrivals hallway to immigration and baggage claim." }] },
  departure: { summary: "Departure guidance and check-in procedures.", steps: [{ audience: "all", title: "Check-in & Security", body: "Check in 3 hours before international flights." }] },
  transport: [
    { direction: "from_airport", type: "bus", name: "Bus 109", destinationLabel: "District 1", summary: "Express city bus", duration: { minMinutes: 30, maxMinutes: 45 }, price: { min: 20000, max: 20000, currency: "VND" }, operatingHours: "05:30–01:00", pickupLocation: "Terminal 2 B lane", bestFor: "Budget travellers", luggageSummary: "Standard luggage", accessibilitySummary: "Step-free access", bookingUrl: null, sourceUrl: "https://example.com/bus", lastVerifiedAt: "2026-08-04" },
    { direction: "to_airport", type: "taxi", name: "Taxi / Grab", destinationLabel: "SGN", summary: "Door to terminal", duration: { minMinutes: 30, maxMinutes: 60 }, price: { min: 120000, max: 200000, currency: "VND" }, operatingHours: "24 hours", pickupLocation: "Any city location", bestFor: "Fastest convenience", luggageSummary: "Large luggage capacity", accessibilitySummary: null, bookingUrl: null, sourceUrl: "https://example.com/taxi", lastVerifiedAt: "2026-08-04" },
  ],
  terminals: [{ code: "T1", name: "Domestic Terminal" }, { code: "T2", name: "International Terminal" }],
  facilities: [],
  lounges: [{ name: "Lotus Lounge", location: "Terminal 2 Airside", locationType: "airside", access: "Business / SkyTeam / Paid", operatingHours: "24 hours", amenities: ["wifi", "buffet", "showers"], estimatedPrice: { min: 35, max: 45, currency: "USD" }, affiliateUrl: null, sourceUrl: "https://example.com/lounge", lastVerifiedAt: "2026-08-04" }],
  notices: [],
  faqs: [{ question: "How far is SGN from District 1?", answer: "Approximately 8 km, taking 30–60 minutes depending on traffic." }],
  links: [],
  provenance: { reviewedAt: "2026-08-04", freshnessAt: "2026-08-04", routeDataRefreshedAt: "2026-08-05", dataVersion: "dev-v1" },
};

export async function getAirportPage(airportIata: string, locale = "en-GB"): Promise<AirportPageModel> {
  try {
    return await loadPageModel({ pageType: "airport", entityKey: airportIata, locale, parse: parseAirportPageResponse });
  } catch (err) {
    if (process.env.NODE_ENV === "development" || process.env.APP_ENV === "local") {
      return {
        ...DEV_AIRPORT_MOCK,
        airport: { ...DEV_AIRPORT_MOCK.airport, iata: airportIata.toUpperCase() },
      };
    }
    throw err;
  }
}

