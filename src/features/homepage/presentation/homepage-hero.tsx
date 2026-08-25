"use client";

import { useEffect, useRef, useState } from "react";
import { resolveNearestHub } from "../domain/homepage-geo";
import {
  HUB_AIRPORTS,
  searchHubs,
  type HubAirport,
} from "../domain/homepage-routes-data";

type HomepageHeroProps = {
  currentHub: HubAirport;
  onSelectHub: (hub: HubAirport) => void;
  model?: {
    publishedDirectRouteCount: number;
    originCityCount: number;
    originAirportCount: number;
  };
};

export function HomepageHero({ currentHub, onSelectHub, model }: HomepageHeroProps) {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = query.trim() ? searchHubs(query, 5) : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (hub: HubAirport) => {
    setQuery(`${hub.cityName} (${hub.iata})`);
    setIsDropdownOpen(false);
    onSelectHub(hub);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const hub = resolveNearestHub({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        handleSelect(hub);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedHub =
      searchHubs(query, 1)[0] ??
      HUB_AIRPORTS.find((h) => h.iata.toLowerCase() === query.trim().toLowerCase());
    if (matchedHub) {
      handleSelect(matchedHub);
    }
  };

  return (
    <section className="home-hero-section">
      <div className="pseo-container home-hero-container">
        <h1 className="home-hero__title">Where can you fly nonstop?</h1>
        <p className="home-hero__intro">
          Enter your departure city to see every destination you can reach without a
          connection. Compare airlines, flight times, and routes in one place.
        </p>
        {model && (
          <p className="home-hero__network-badge">
            ⚡ <strong>{model.publishedDirectRouteCount.toLocaleString("en-GB")}</strong> direct routes across <strong>{model.originCityCount.toLocaleString("en-GB")}</strong> cities
          </p>
        )}

        <div className="home-search-bar-wrap" ref={containerRef}>
          <form className="home-search-bar" onSubmit={handleSubmit} role="search">
            <div className="home-search-input-group">
              <label htmlFor="flying-from-input" className="home-search-label">
                FLYING FROM
              </label>
              <input
                id="flying-from-input"
                type="text"
                className="home-search-input"
                placeholder={currentHub ? `${currentHub.cityName} (${currentHub.iata})` : "City, airport, or country"}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  if (query.trim()) setIsDropdownOpen(true);
                }}
                autoComplete="off"
              />
            </div>

            <button
              type="button"
              className={`home-search-geo-btn ${isLocating ? "is-locating" : ""}`}
              onClick={handleLocateMe}
              title="Detect my current location"
              aria-label="Detect my current location"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </button>

            <button type="submit" className="home-search-submit-btn">
              SHOW ME
            </button>
          </form>

          {isDropdownOpen && suggestions.length > 0 && (
            <ul className="home-search-suggestions" role="listbox">
              {suggestions.map((hub) => (
                <li
                  key={hub.iata}
                  className="home-search-suggestion-item"
                  role="option"
                  aria-selected="false"
                  onClick={() => handleSelect(hub)}
                >
                  <div className="home-suggestion-city">
                    <strong>{hub.cityName}</strong>, {hub.countryName}
                  </div>
                  <span className="home-suggestion-iata">{hub.iata}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
