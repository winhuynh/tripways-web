/**
 * Human-friendly dictionary and label formatters for flight route filters.
 * Translates raw codes (IATA 3-letter airport, IATA 2-letter airline, ISO-2 country)
 * into readable entity and city names.
 */

export const AIRPORT_CITY_NAMES: Readonly<Record<string, { city: string; name: string }>> = {
  SGN: { city: "Ho Chi Minh City", name: "Tan Son Nhat International Airport" },
  HAN: { city: "Hanoi", name: "Noi Bai International Airport" },
  DAD: { city: "Da Nang", name: "Da Nang International Airport" },
  CXR: { city: "Nha Trang", name: "Cam Ranh International Airport" },
  PQC: { city: "Phu Quoc", name: "Phu Quoc International Airport" },
  HPH: { city: "Hai Phong", name: "Cat Bi International Airport" },
  VCA: { city: "Can Tho", name: "Can Tho International Airport" },
  HUI: { city: "Hue", name: "Phu Bai International Airport" },
  SIN: { city: "Singapore", name: "Singapore Changi Airport" },
  XSP: { city: "Singapore", name: "Seletar Airport" },
  BKK: { city: "Bangkok", name: "Suvarnabhumi Airport" },
  DMK: { city: "Bangkok", name: "Don Mueang International Airport" },
  HKT: { city: "Phuket", name: "Phuket International Airport" },
  CNX: { city: "Chiang Mai", name: "Chiang Mai International Airport" },
  USM: { city: "Koh Samui", name: "Samui Airport" },
  KBV: { city: "Krabi", name: "Krabi International Airport" },
  KUL: { city: "Kuala Lumpur", name: "Kuala Lumpur International Airport" },
  SZB: { city: "Kuala Lumpur", name: "Sultan Abdul Aziz Shah Airport" },
  PEN: { city: "Penang", name: "Penang International Airport" },
  BKI: { city: "Kota Kinabalu", name: "Kota Kinabalu International Airport" },
  CGK: { city: "Jakarta", name: "Soekarno-Hatta International Airport" },
  HLP: { city: "Jakarta", name: "Halim Perdanakusuma International Airport" },
  DPS: { city: "Bali", name: "Ngurah Rai International Airport" },
  SUB: { city: "Surabaya", name: "Juanda International Airport" },
  MNL: { city: "Manila", name: "Ninoy Aquino International Airport" },
  CEB: { city: "Cebu", name: "Mactan-Cebu International Airport" },
  CRK: { city: "Clark", name: "Clark International Airport" },
  PNH: { city: "Phnom Penh", name: "Phnom Penh International Airport" },
  REP: { city: "Siem Reap", name: "Siem Reap-Angkor International Airport" },
  SAI: { city: "Siem Reap", name: "Siem Reap-Angkor International Airport" },
  VTE: { city: "Vientiane", name: "Wattay International Airport" },
  LPQ: { city: "Luang Prabang", name: "Luang Prabang International Airport" },
  RGN: { city: "Yangon", name: "Yangon International Airport" },
  MDL: { city: "Mandalay", name: "Mandalay International Airport" },
  LHR: { city: "London", name: "Heathrow Airport" },
  LGW: { city: "London", name: "Gatwick Airport" },
  STN: { city: "London", name: "Stansted Airport" },
  LTN: { city: "London", name: "Luton Airport" },
  LCY: { city: "London", name: "London City Airport" },
  SEN: { city: "London", name: "Southend Airport" },
  CDG: { city: "Paris", name: "Charles de Gaulle Airport" },
  ORY: { city: "Paris", name: "Orly Airport" },
  FRA: { city: "Frankfurt", name: "Frankfurt Airport" },
  MUC: { city: "Munich", name: "Munich Airport" },
  BER: { city: "Berlin", name: "Berlin Brandenburg Airport" },
  AMS: { city: "Amsterdam", name: "Amsterdam Airport Schiphol" },
  MAD: { city: "Madrid", name: "Adolfo Suárez Madrid-Barajas Airport" },
  BCN: { city: "Barcelona", name: "Josep Tarradellas Barcelona-El Prat Airport" },
  FCO: { city: "Rome", name: "Leonardo da Vinci-Fiumicino Airport" },
  CIA: { city: "Rome", name: "Ciampino Airport" },
  MXP: { city: "Milan", name: "Milan Malpensa Airport" },
  LIN: { city: "Milan", name: "Linate Airport" },
  ZRH: { city: "Zurich", name: "Zurich Airport" },
  GVA: { city: "Geneva", name: "Geneva Airport" },
  VIE: { city: "Vienna", name: "Vienna International Airport" },
  IST: { city: "Istanbul", name: "Istanbul Airport" },
  SAW: { city: "Istanbul", name: "Sabiha Gökçen International Airport" },
  DXB: { city: "Dubai", name: "Dubai International Airport" },
  DWC: { city: "Dubai", name: "Al Maktoum International Airport" },
  AUH: { city: "Abu Dhabi", name: "Zayed International Airport" },
  DOH: { city: "Doha", name: "Hamad International Airport" },
  HND: { city: "Tokyo", name: "Haneda Airport" },
  NRT: { city: "Tokyo", name: "Narita International Airport" },
  KIX: { city: "Osaka", name: "Kansai International Airport" },
  ITM: { city: "Osaka", name: "Itami Airport" },
  NGO: { city: "Nagoya", name: "Chubu Centrair International Airport" },
  FUK: { city: "Fukuoka", name: "Fukuoka Airport" },
  CTS: { city: "Sapporo", name: "New Chitose Airport" },
  OKA: { city: "Okinawa", name: "Naha Airport" },
  ICN: { city: "Seoul", name: "Incheon International Airport" },
  GMP: { city: "Seoul", name: "Gimpo International Airport" },
  PUS: { city: "Busan", name: "Gimhae International Airport" },
  HKG: { city: "Hong Kong", name: "Hong Kong International Airport" },
  MFM: { city: "Macau", name: "Macau International Airport" },
  TPE: { city: "Taipei", name: "Taoyuan International Airport" },
  TSA: { city: "Taipei", name: "Songshan Airport" },
  KHH: { city: "Kaohsiung", name: "Kaohsiung International Airport" },
  PEK: { city: "Beijing", name: "Capital International Airport" },
  PKX: { city: "Beijing", name: "Daxing International Airport" },
  PVG: { city: "Shanghai", name: "Pudong International Airport" },
  SHA: { city: "Shanghai", name: "Hongqiao International Airport" },
  CAN: { city: "Guangzhou", name: "Baiyun International Airport" },
  SZX: { city: "Shenzhen", name: "Bao'an International Airport" },
  CTU: { city: "Chengdu", name: "Shuangliu International Airport" },
  TFU: { city: "Chengdu", name: "Tianfu International Airport" },
  DEL: { city: "New Delhi", name: "Indira Gandhi International Airport" },
  BOM: { city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport" },
  BLR: { city: "Bengaluru", name: "Kempegowda International Airport" },
  MAA: { city: "Chennai", name: "Chennai International Airport" },
  SYD: { city: "Sydney", name: "Kingsford Smith Airport" },
  MEL: { city: "Melbourne", name: "Melbourne Airport" },
  BNE: { city: "Brisbane", name: "Brisbane Airport" },
  PER: { city: "Perth", name: "Perth Airport" },
  ADL: { city: "Adelaide", name: "Adelaide Airport" },
  AKL: { city: "Auckland", name: "Auckland Airport" },
  CHC: { city: "Christchurch", name: "Christchurch International Airport" },
  JFK: { city: "New York", name: "John F. Kennedy International Airport" },
  EWR: { city: "New York", name: "Newark Liberty International Airport" },
  LGA: { city: "New York", name: "LaGuardia Airport" },
  LAX: { city: "Los Angeles", name: "Los Angeles International Airport" },
  SFO: { city: "San Francisco", name: "San Francisco International Airport" },
  ORD: { city: "Chicago", name: "O'Hare International Airport" },
  DFW: { city: "Dallas", name: "Dallas/Fort Worth International Airport" },
  MIA: { city: "Miami", name: "Miami International Airport" },
  SEA: { city: "Seattle", name: "Seattle-Tacoma International Airport" },
  BOS: { city: "Boston", name: "Logan International Airport" },
  YVR: { city: "Vancouver", name: "Vancouver International Airport" },
  YYZ: { city: "Toronto", name: "Toronto Pearson International Airport" },
};

export const AIRLINE_NAMES: Readonly<Record<string, string>> = {
  VN: "Vietnam Airlines",
  VJ: "VietJet Air",
  QH: "Bamboo Airways",
  VU: "Vietravel Airlines",
  SQ: "Singapore Airlines",
  TR: "Scoot",
  TG: "Thai Airways",
  FD: "Thai AirAsia",
  PG: "Bangkok Airways",
  AK: "AirAsia",
  D7: "AirAsia X",
  MH: "Malaysia Airlines",
  OD: "Batik Air Malaysia",
  GA: "Garuda Indonesia",
  QZ: "Indonesia AirAsia",
  JT: "Lion Air",
  ID: "Batik Air",
  PR: "Philippine Airlines",
  "5J": "Cebu Pacific",
  Z2: "Philippines AirAsia",
  K6: "Cambodia Angkor Air",
  QV: "Lao Airlines",
  UB: "Myanmar National Airlines",
  CX: "Cathay Pacific",
  UO: "HK Express",
  CI: "China Airlines",
  BR: "EVA Air",
  JX: "Starlux Airlines",
  JL: "Japan Airlines",
  NH: "All Nippon Airways",
  GK: "Jetstar Japan",
  MM: "Peach Aviation",
  KE: "Korean Air",
  OZ: "Asiana Airlines",
  LJ: "Jin Air",
  TW: "T'way Air",
  CA: "Air China",
  CZ: "China Southern Airlines",
  MU: "China Eastern Airlines",
  HU: "Hainan Airlines",
  MF: "XiamenAir",
  EK: "Emirates",
  QR: "Qatar Airways",
  EY: "Etihad Airways",
  TK: "Turkish Airlines",
  BA: "British Airways",
  AF: "Air France",
  KL: "KLM",
  LH: "Lufthansa",
  LX: "Swiss International Air Lines",
  OS: "Austrian Airlines",
  AY: "Finnair",
  SK: "SAS Scandinavian Airlines",
  QF: "Qantas",
  JQ: "Jetstar",
  VA: "Virgin Australia",
  NZ: "Air New Zealand",
  UA: "United Airlines",
  AA: "American Airlines",
  DL: "Delta Air Lines",
  AC: "Air Canada",
  AI: "Air India",
  "6E": "IndiGo",
  UK: "Vistara",
};

export const COUNTRY_NAMES: Readonly<Record<string, string>> = {
  VN: "Vietnam",
  SG: "Singapore",
  TH: "Thailand",
  MY: "Malaysia",
  ID: "Indonesia",
  PH: "Philippines",
  KH: "Cambodia",
  LA: "Laos",
  MM: "Myanmar",
  BN: "Brunei",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  TW: "Taiwan",
  HK: "Hong Kong",
  MO: "Macau",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  TR: "Turkey",
  AE: "United Arab Emirates",
  QA: "Qatar",
  SA: "Saudi Arabia",
  IN: "India",
  AU: "Australia",
  NZ: "New Zealand",
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
};

export const REGION_NAMES: Readonly<Record<string, string>> = {
  asia: "Asia",
  southeast_asia: "Southeast Asia",
  east_asia: "East Asia",
  south_asia: "South Asia",
  central_asia: "Central Asia",
  europe: "Europe",
  western_europe: "Western Europe",
  eastern_europe: "Eastern Europe",
  northern_europe: "Northern Europe",
  southern_europe: "Southern Europe",
  north_america: "North America",
  south_america: "South America",
  latin_america: "Latin America",
  middle_east: "Middle East",
  oceania: "Oceania",
  africa: "Africa",
};

/**
 * Returns a human-friendly display label for an airport/city.
 * Example: 'Singapore (SIN)', 'Ho Chi Minh City (SGN)', 'Bangkok (BKK)'.
 */
export function getAirportDisplay(code: string, customName?: string): string {
  const normalized = code.trim().toUpperCase();
  const entry = AIRPORT_CITY_NAMES[normalized];
  if (typeof customName === "string" && customName.trim()) {
    return `${customName.trim()} (${normalized})`;
  }
  if (entry) {
    return `${entry.city} (${normalized})`;
  }
  return normalized;
}

/**
 * Returns detailed airport name label if available.
 * Example: 'Singapore Changi (SIN)', 'Tan Son Nhat (SGN)'.
 */
export function getAirportDetailedDisplay(code: string, customName?: string): string {
  const normalized = code.trim().toUpperCase();
  const entry = AIRPORT_CITY_NAMES[normalized];
  if (typeof customName === "string" && customName.trim()) {
    return `${customName.trim()} (${normalized})`;
  }
  if (entry) {
    return `${entry.name} (${normalized})`;
  }
  return normalized;
}

/**
 * Returns a human-friendly display label for an airline.
 * Example: 'Vietnam Airlines (VN)', 'Singapore Airlines (SQ)'.
 */
export function getAirlineDisplay(code: string): string {
  const normalized = code.trim().toUpperCase();
  const name = AIRLINE_NAMES[normalized];
  if (name) {
    return `${name} (${normalized})`;
  }
  return normalized;
}

/**
 * Returns a human-friendly country name.
 * Example: 'Vietnam', 'Singapore', 'United Kingdom'.
 */
export function getCountryDisplay(code: string): string {
  const normalized = code.trim().toUpperCase();
  const name = COUNTRY_NAMES[normalized];
  if (name) {
    return name;
  }
  return humanize(code);
}

/**
 * Returns a human-friendly region name.
 * Example: 'Southeast Asia', 'Europe'.
 */
export function getRegionDisplay(code: string): string {
  const normalized = code.trim().toLowerCase();
  const name = REGION_NAMES[normalized];
  if (name) {
    return name;
  }
  return humanize(code);
}

/**
 * Formats minutes into human-readable duration (e.g. 150 -> '2h 30m').
 */
export function formatDurationMinutes(minutes: number): string {
  if (minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return `${remaining}m`;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}

/**
 * Formats time bucket enum values.
 */
export function formatTimeBucketLabel(bucket: string): string {
  switch (bucket) {
    case "early_morning":
      return "Early morning (00:00 – 06:00)";
    case "morning":
      return "Morning (06:00 – 12:00)";
    case "afternoon":
      return "Afternoon (12:00 – 18:00)";
    case "evening":
      return "Evening (18:00 – 24:00)";
    default:
      return humanize(bucket);
  }
}

/**
 * Formats stops into descriptive label.
 */
export function formatStopsLabel(stops: number): string {
  switch (stops) {
    case 0:
      return "Nonstop only";
    case 1:
      return "Up to 1 stop";
    case 2:
      return "Up to 2 stops";
    case 3:
      return "Up to 3 stops";
    default:
      return `${stops} stops`;
  }
}

export function humanize(value: string): string {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
