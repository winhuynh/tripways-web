import { describe, expect, it } from "vitest";

import {
  CityDestinationsHttpError,
  createCityDestinationsHttpResponse,
  parseCityDestinationsHttpRequest,
} from "./city-destinations-http";

describe("City destinations HTTP adapter", () => {
  it("rejects requests without a city identity", () => {
    expect(() =>
      parseCityDestinationsHttpRequest(
        new Request("http://localhost/api/city-page/destinations"),
      ),
    ).toThrowError(
      new CityDestinationsHttpError("ERR_INVALID_REQUEST", 400),
    );
  });

  it("normalizes supported query parameters into a bounded read query", () => {
    const request = new Request(
      "http://localhost/api/city-page/destinations?city=%20Bangkok%20&airport=%20bkk%20",
    );

    expect(parseCityDestinationsHttpRequest(request)).toEqual({
      citySlug: "bangkok",
      locale: "en-GB",
      originAirports: ["BKK"],
      limit: 20,
      offset: 0,
    });
  });

  it("wraps application results in the stable public success envelope", () => {
    const result = { status: "empty" as const };

    expect(createCityDestinationsHttpResponse(result)).toEqual({
      data: result,
      error: null,
    });
  });
});
