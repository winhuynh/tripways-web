import { NextResponse } from "next/server";

import {
  CityDestinationsHttpError,
  createCityDestinationsHttpResponse,
  parseCityDestinationsHttpRequest,
} from "@/features/city-page";
import { cityPage } from "@/features/city-page/server";

/**
 * Adapts the public destination HTTP request to the City Page application
 * boundary and returns its stable JSON envelope.
 */
export async function GET(request: Request) {
  try {
    const query = parseCityDestinationsHttpRequest(request);
    const result = await cityPage.getDestinations(query);

    return NextResponse.json(createCityDestinationsHttpResponse(result));
  } catch (error) {
    if (error instanceof CityDestinationsHttpError) {
      return NextResponse.json(
        { data: null, error: { code: error.code } },
        { status: error.status },
      );
    }

    throw error;
  }
}
