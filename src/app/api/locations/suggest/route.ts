import { NextResponse } from "next/server";
import { extractServerRequestId, serverLogger } from "@/lib/server/logger";
import {
  searchLocationSuggestions,
  getNearbyAirports,
  type LocationSuggestionItem,
} from "@/features/homepage/domain/location-suggest";

export async function GET(request: Request) {
  const requestId = extractServerRequestId(request);
  const startTime = performance.now();
  const logContext = {
    requestId,
    feature: "location-suggest",
    method: "GET",
  };

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

    const durationMs = Math.round(performance.now() - startTime);
    serverLogger.info("LOCATION_SUGGEST_SUCCESS", {
      ...logContext,
      queryLength: query.length,
      itemCount: items.length,
      durationMs,
    });

    return NextResponse.json(
      { data: items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    serverLogger.error("LOCATION_SUGGEST_ERROR", error, {
      ...logContext,
      durationMs,
      errorCode: "ERR_SUGGEST_FAILED",
    });

    return NextResponse.json(
      { error: "ERR_SUGGEST_FAILED", message: String(error) },
      { status: 500, headers: { "x-request-id": requestId } },
    );
  }
}
