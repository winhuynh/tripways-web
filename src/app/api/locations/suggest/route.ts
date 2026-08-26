import { NextResponse } from "next/server";
import {
  searchLocationSuggestions,
  getNearbyAirports,
  type LocationSuggestionItem,
} from "@/features/homepage/domain/location-suggest";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const originIata = searchParams.get("origin") || undefined;
    const radius = Number(searchParams.get("radius") || "300");
    const limit = Number(searchParams.get("limit") || "10");

    let items: LocationSuggestionItem[];

    if (!query.trim() && originIata) {
      items = getNearbyAirports({
        originIata,
        maxDistanceKm: radius,
        limit,
      });
    } else {
      items = searchLocationSuggestions(query, {
        originIata,
        limit,
        includeQuickActions: true,
      });
    }

    return NextResponse.json(
      { data: items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "ERR_SUGGEST_FAILED", message: String(error) },
      { status: 500 },
    );
  }
}
