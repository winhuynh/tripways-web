export type Airport = Readonly<{
  iata: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}>;

export const AIRPORTS: readonly Airport[] = [
  {
    iata: "SGN",
    name: "Tan Son Nhat International Airport",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    countryCode: "VN",
    latitude: 10.8188,
    longitude: 106.6519,
  },
  {
    iata: "SIN",
    name: "Singapore Changi Airport",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    latitude: 1.3644,
    longitude: 103.9915,
  },
  {
    iata: "BKK",
    name: "Suvarnabhumi Airport",
    city: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    latitude: 13.69,
    longitude: 100.7501,
  },
  {
    iata: "LHR",
    name: "Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    latitude: 51.47,
    longitude: -0.4543,
  },
  {
    iata: "CDG",
    name: "Charles de Gaulle Airport",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    latitude: 49.0097,
    longitude: 2.5479,
  },
] as const;

/** Finds an airport from the small discovery catalogue by normalized IATA code. */
export function getAirport(value: string): Airport | undefined {
  const normalizedIata = value.trim().toUpperCase();

  return AIRPORTS.find((airport) => airport.iata === normalizedIata);
}

/** Lists the discovery candidates while excluding the selected origin airport. */
export function listDestinationCandidates(originIata: string): Airport[] {
  const normalizedOrigin = originIata.trim().toUpperCase();

  return AIRPORTS.filter((airport) => airport.iata !== normalizedOrigin);
}
