"use client";

import {
  findHub,
  POPULAR_CITIES,
  type HubAirport,
  type PopularCityItem,
} from "../domain/homepage-routes-data";

type PopularCitiesSectionProps = {
  cities?: readonly PopularCityItem[];
  onSelectCity?: (hub: HubAirport) => void;
};

export function PopularCitiesSection({
  cities = POPULAR_CITIES,
  onSelectCity,
}: PopularCitiesSectionProps) {
  const handleCityClick = (cityItem: PopularCityItem) => {
    const hub = findHub(cityItem.slug) || findHub(cityItem.iata);
    if (hub && onSelectCity) {
      onSelectCity(hub);
      // Smoothly scroll back to top hero/map area
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      className="home-popular-cities-section"
      aria-label="Find nonstop flights from popular cities"
    >
      <div className="pseo-container">
        <h2 className="home-popular-cities__title">
          Find nonstop flights from popular cities
        </h2>

        <div className="home-popular-cities__grid">
          {cities.map((city) => (
            <button
              key={city.slug}
              type="button"
              className="home-city-circle-btn"
              onClick={() => handleCityClick(city)}
              title={`Explore nonstop flights from ${city.name}`}
            >
              <div className="home-city-circle-avatar">
                <span className="home-city-avatar-code">{city.iata}</span>
              </div>
              <span className="home-city-circle-name">{city.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
