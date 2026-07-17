export type Airport = {
  iata: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  mapX: number;
  mapY: number;
};

export const AIRPORTS: readonly Airport[] = [
  {
    iata: "SGN",
    name: "Tan Son Nhat International Airport",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    countryCode: "VN",
    mapX: 74,
    mapY: 61,
  },
  {
    iata: "SIN",
    name: "Singapore Changi Airport",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    mapX: 74,
    mapY: 68,
  },
  {
    iata: "BKK",
    name: "Suvarnabhumi Airport",
    city: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    mapX: 71,
    mapY: 57,
  },
  {
    iata: "LHR",
    name: "Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    mapX: 46,
    mapY: 32,
  },
  {
    iata: "CDG",
    name: "Charles de Gaulle Airport",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    mapX: 48,
    mapY: 35,
  },
] as const;

export function getAirport(value: string): Airport | undefined {
  const normalizedIata = value.trim().toUpperCase();

  return AIRPORTS.find((airport) => airport.iata === normalizedIata);
}

export function listDestinationCandidates(originIata: string): Airport[] {
  const normalizedOrigin = originIata.trim().toUpperCase();

  return AIRPORTS.filter((airport) => airport.iata !== normalizedOrigin);
}
