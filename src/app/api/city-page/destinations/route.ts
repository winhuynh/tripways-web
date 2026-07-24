import { NextResponse } from "next/server";

import { cityPage } from "@/features/city-page/server";

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const citySlug = search.get("city")?.trim().toLowerCase();
  if (!citySlug) {
    return NextResponse.json({ data: null, error: { code: "ERR_INVALID_REQUEST" } }, { status: 400 });
  }

  const result = await cityPage.getDestinations({
    citySlug,
    locale: "en-GB",
    originAirports: search.get("airport")
      ? [search.get("airport")!.trim().toUpperCase()]
      : undefined,
    limit: 20,
    offset: 0,
  });

  return NextResponse.json({ data: result, error: null });
}
