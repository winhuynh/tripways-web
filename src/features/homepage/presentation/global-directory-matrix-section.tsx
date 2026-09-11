import Link from "next/link";

type DirectoryRegion = Readonly<{
  region: string;
  hubs: ReadonlyArray<{
    cityName: string;
    citySlug: string;
    iata: string;
    airportName: string;
  }>;
}>;

const GLOBAL_DIRECTORY: readonly DirectoryRegion[] = [
  {
    region: "Asia & Pacific",
    hubs: [
      { cityName: "Singapore", citySlug: "singapore", iata: "SIN", airportName: "Singapore Changi" },
      { cityName: "Tokyo", citySlug: "tokyo", iata: "HND", airportName: "Tokyo Haneda" },
      { cityName: "Bangkok", citySlug: "bangkok", iata: "BKK", airportName: "Suvarnabhumi" },
      { cityName: "Ho Chi Minh City", citySlug: "ho-chi-minh-city", iata: "SGN", airportName: "Tan Son Nhat" },
      { cityName: "Sydney", citySlug: "sydney", iata: "SYD", airportName: "Sydney Kingsford Smith" },
      { cityName: "Seoul", citySlug: "seoul", iata: "ICN", airportName: "Incheon" },
      { cityName: "Kuala Lumpur", citySlug: "kuala-lumpur", iata: "KUL", airportName: "Kuala Lumpur Intl" },
    ],
  },
  {
    region: "Europe",
    hubs: [
      { cityName: "London", citySlug: "london", iata: "LHR", airportName: "Heathrow" },
      { cityName: "Paris", citySlug: "paris", iata: "CDG", airportName: "Charles de Gaulle" },
      { cityName: "Frankfurt", citySlug: "frankfurt", iata: "FRA", airportName: "Frankfurt" },
      { cityName: "Amsterdam", citySlug: "amsterdam", iata: "AMS", airportName: "Schiphol" },
      { cityName: "Rome", citySlug: "rome", iata: "FCO", airportName: "Fiumicino" },
      { cityName: "Barcelona", citySlug: "barcelona", iata: "BCN", airportName: "El Prat" },
      { cityName: "Istanbul", citySlug: "istanbul", iata: "IST", airportName: "Istanbul Airport" },
    ],
  },
  {
    region: "North America",
    hubs: [
      { cityName: "New York", citySlug: "new-york", iata: "JFK", airportName: "John F. Kennedy" },
      { cityName: "Los Angeles", citySlug: "los-angeles", iata: "LAX", airportName: "Los Angeles Intl" },
      { cityName: "San Francisco", citySlug: "san-francisco", iata: "SFO", airportName: "San Francisco Intl" },
      { cityName: "Chicago", citySlug: "chicago", iata: "ORD", airportName: "O'Hare" },
    ],
  },
  {
    region: "Middle East",
    hubs: [
      { cityName: "Dubai", citySlug: "dubai", iata: "DXB", airportName: "Dubai International" },
      { cityName: "Doha", citySlug: "doha", iata: "DOH", airportName: "Hamad International" },
    ],
  },
];

export function GlobalDirectoryMatrixSection() {
  return (
    <section
      className="home-directory-section"
      aria-label="Worldwide flight routes and airport hubs directory"
    >
      <div className="pseo-container">
        <div className="home-directory__header">
          <span className="home-section-eyebrow">Global Network</span>
          <h2 className="home-directory__title">
            Worldwide Flight Routes &amp; Airport Hubs
          </h2>
          <p className="home-directory__intro">
            Browse nonstop flight networks across major regional hubs and global airport gateways.
          </p>
        </div>

        <div className="home-directory__grid">
          {GLOBAL_DIRECTORY.map((col) => (
            <div key={col.region} className="home-directory-col">
              <h3 className="home-directory-col__heading">{col.region}</h3>
              <ul className="home-directory-col__list">
                {col.hubs.map((hub) => (
                  <li key={hub.iata} className="home-directory-col__item">
                    <Link
                      href={`/flights-from/${hub.citySlug}`}
                      className="home-directory-col__link"
                    >
                      <span className="home-directory-col__city">Flights from {hub.cityName}</span>
                      <span className="home-directory-col__iata">{hub.iata}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
