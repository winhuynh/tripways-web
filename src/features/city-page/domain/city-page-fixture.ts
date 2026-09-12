import type { CityPageModel } from "./city-page-model";

export const BANGKOK_CITY_PAGE_FIXTURE: CityPageModel = {
  city: { name: "Bangkok", slug: "bangkok" },
  country: { name: "Thailand", slug: "thailand", region: "Asia" },
  seo: {
    h1: "Direct flights from Bangkok",
    subheadline:
      "Explore 180+ direct routes and compare departures from Suvarnabhumi (BKK) and Don Mueang (DMK)",
    title: "Direct Flights from Bangkok: Routes & Airlines | Tripways",
    description:
      "Explore verified direct flights from Bangkok. Compare departures across Suvarnabhumi (BKK) and Don Mueang (DMK), with weekly schedules, flight times, and fares.",
    intro:
      "Bangkok connects travelers globally through two major hubs: Suvarnabhumi (BKK) for long-haul intercontinental flights and full-service carriers, and Don Mueang (DMK) for low-cost and regional flights. Compare all direct destinations, check weekly flight schedules, and find the best fares.",
  },
  quickFacts: {
    destinations: 182,
    countries: 67,
    airlines: 48,
    airports: 2,
  },
  airports: [
    {
      iata: "BKK",
      name: "Suvarnabhumi Airport",
      primary: true,
      destinations: 128,
      airlines: 84,
      role: "International & Long-Haul",
      description:
        "Bangkok's premier international gateway. Home to Thai Airways and major global flag carriers connecting direct to Europe, the Middle East, and beyond.",
    },
    {
      iata: "DMK",
      name: "Don Mueang International Airport",
      primary: false,
      destinations: 64,
      airlines: 12,
      role: "Budget & Regional Flights",
      description:
        "The primary hub for low-cost carriers like Thai AirAsia, Lion Air, and Nok Air, specializing in affordable domestic routes and regional Asian travel.",
    },
  ],
  destinations: [
    {
      city: "Singapore",
      citySlug: "singapore",
      country: "Singapore",
      region: "SE Asia",
      originAirports: ["BKK", "DMK"],
      airports: ["SIN"],
      airlines: ["SQ", "TG", "3K", "TR"],
      frequency: 84,
      minDuration: 145,
      maxDuration: 160,
      path: "/flights/bangkok-to-singapore",
      fareMin: 45,
      fareMax: 85,
    },
    {
      city: "Tokyo",
      citySlug: "tokyo",
      country: "Japan",
      region: "East Asia",
      originAirports: ["BKK", "DMK"],
      airports: ["NRT", "HND"],
      airlines: ["TG", "JL", "NH", "XJ"],
      frequency: 70,
      minDuration: 375,
      maxDuration: 405,
      path: "/flights/bangkok-to-tokyo",
      fareMin: 180,
      fareMax: 320,
    },
    {
      city: "London",
      citySlug: "london",
      country: "United Kingdom",
      region: "Europe",
      originAirports: ["BKK"],
      airports: ["LHR"],
      airlines: ["TG", "BR", "BA"],
      frequency: 28,
      minDuration: 765,
      maxDuration: 810,
      path: "/flights/bangkok-to-london",
      fareMin: 350,
      fareMax: 650,
    },
    {
      city: "Hong Kong",
      citySlug: "hong-kong",
      country: "Hong Kong",
      region: "East Asia",
      originAirports: ["BKK", "DMK"],
      airports: ["HKG"],
      airlines: ["CX", "TG", "EK", "UO"],
      frequency: 75,
      minDuration: 175,
      maxDuration: 195,
      path: "/flights/bangkok-to-hong-kong",
      fareMin: 85,
      fareMax: 160,
    },
    {
      city: "Sydney",
      citySlug: "sydney",
      country: "Australia",
      region: "Oceania",
      originAirports: ["BKK"],
      airports: ["SYD"],
      airlines: ["TG", "QF", "JQ"],
      frequency: 21,
      minDuration: 550,
      maxDuration: 580,
      path: "/flights/bangkok-to-sydney",
      fareMin: 350,
      fareMax: 580,
    },
    {
      city: "Phuket",
      citySlug: "phuket",
      country: "Thailand",
      region: "SE Asia",
      originAirports: ["BKK", "DMK"],
      airports: ["HKT"],
      airlines: ["TG", "PG", "VZ", "FD"],
      frequency: 150,
      minDuration: 85,
      maxDuration: 95,
      path: "/flights/bangkok-to-phuket",
      fareMin: 25,
      fareMax: 50,
    },
    {
      city: "Paris",
      citySlug: "paris",
      country: "France",
      region: "Europe",
      originAirports: ["BKK"],
      airports: ["CDG"],
      airlines: ["TG", "AF"],
      frequency: 14,
      minDuration: 770,
      maxDuration: 815,
      path: "/flights/bangkok-to-paris",
      fareMin: 380,
      fareMax: 690,
    },
    {
      city: "Dubai",
      citySlug: "dubai",
      country: "United Arab Emirates",
      region: "Middle East",
      originAirports: ["BKK"],
      airports: ["DXB"],
      airlines: ["EK", "FZ"],
      frequency: 35,
      minDuration: 380,
      maxDuration: 410,
      path: "/flights/bangkok-to-dubai",
      fareMin: 210,
      fareMax: 410,
    },
  ],
  faqs: [
    {
      question: "Which airports serve Bangkok?",
      answer:
        "Bangkok is served by two international airports: Suvarnabhumi Airport (BKK) and Don Mueang International Airport (DMK). Don Mueang (DMK) is generally 25–40% cheaper for budget travelers flying across Southeast Asia via low-cost carriers like Thai AirAsia, Lion Air, and Nok Air. Suvarnabhumi (BKK) caters to full-service carriers and long-haul intercontinental routes to Europe, the Middle East, and the Americas.",
    },
    {
      question: "Which direct routes from Bangkok offer the lowest fares?",
      answer:
        "Short direct flights from Bangkok to Cambodia (Siem Reap, Phnom Penh), Malaysia (Kuala Lumpur, Penang), and domestic Thai beach hubs (Phuket, Krabi) frequently feature the lowest one-way fares starting from £25 to £45 depending on advance booking.",
    },
    {
      question: "What direct flights operate from Bangkok to Europe?",
      answer:
        "Direct nonstop flights from Bangkok connect to major European capitals including London Heathrow (LHR), Paris (CDG), Frankfurt (FRA), Zurich (ZRH), and Vienna (VIE), operated by Thai Airways, British Airways, Air France, and Lufthansa.",
    },
    {
      question: "When is the best time to book flights out of Bangkok for the lowest price?",
      answer:
        "Fares are typically most economical during the shoulder and off-peak travel seasons from May to October. For international long-haul routes, booking 4 to 8 weeks in advance secures the best promotional fares on Aviasales.",
    },
    {
      question: "How many nonstop destinations can I reach from Bangkok?",
      answer:
        "Travelers can fly nonstop to over 180 destinations across 67 countries in Asia, Europe, Australia, and the Middle East departing from Bangkok's two airports.",
    },
  ],
  links: [
    {
      title: "BANGKOK AIRPORT HUBS",
      links: [
        {
          label: "Explore flights from Suvarnabhumi (BKK)",
          href: "/airports/bkk",
        },
        {
          label: "Explore flights from Don Mueang (DMK)",
          href: "/airports/dmk",
        },
      ],
    },
    {
      title: "DIRECT DESTINATIONS BY COUNTRY",
      links: [
        {
          label: "Flights from Bangkok to Japan",
          href: "/flights-from/bangkok?destination_countries=JP",
        },
        {
          label: "Flights from Bangkok to Singapore",
          href: "/flights/bangkok-to-singapore",
        },
        {
          label: "Flights from Bangkok to the United Kingdom",
          href: "/flights-from/bangkok?destination_countries=GB",
        },
        {
          label: "Flights from Bangkok to Australia",
          href: "/flights-from/bangkok?destination_countries=AU",
        },
        {
          label: "Flights from Bangkok to Vietnam",
          href: "/flights-from/bangkok?destination_countries=VN",
        },
      ],
    },
    {
      title: "OTHER THAI DEPARTURE HUBS",
      links: [
        {
          label: "Direct flights from Phuket",
          href: "/flights-from/phuket",
        },
        {
          label: "Direct flights from Chiang Mai",
          href: "/flights-from/chiang-mai",
        },
        {
          label: "Direct flights from Koh Samui",
          href: "/flights-from/koh-samui",
        },
        {
          label: "Direct flights from Krabi",
          href: "/flights-from/krabi",
        },
      ],
    },
  ],
  freshnessAt: "2026-08-04",
  canonicalPath: "/flights-from/bangkok",
};
