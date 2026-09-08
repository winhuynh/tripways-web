"use client";

import type { HubAirport } from "../domain/homepage-routes-data";
import { FlightSearchBar } from "./flight-search-bar";

type HomepageHeroProps = {
  currentHub: HubAirport;
  onSelectHub: (hub: HubAirport) => void;
};

export function HomepageHero({ currentHub, onSelectHub }: HomepageHeroProps) {
  return (
    <section className="home-hero-section">
      <div className="pseo-container home-hero-container">
        {/* Google Flights Centered Graphic Illustration */}
        <div className="home-hero-graphic" aria-hidden="true">
          <svg width="180" height="72" viewBox="0 0 180 72" fill="none">
            <circle cx="90" cy="36" r="32" fill="#e8f0fe" />
            <path
              d="M55 44 C75 22 105 22 125 44"
              stroke="#d2e3fc"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <ellipse cx="52" cy="40" rx="14" ry="8" fill="#ffffff" stroke="#dadce0" strokeWidth="1.2" />
            <ellipse cx="128" cy="42" rx="15" ry="9" fill="#ffffff" stroke="#dadce0" strokeWidth="1.2" />
            <g transform="translate(78, 24)">
              <path
                d="M22 13v-1.6l-8-4.8V2.8c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2 1.2v6.4l-8 4.8V16l8-2.4v5.2l-2.4 1.6v1.6l3.6-.8 3.6.8v-1.6l-2.4-1.6v-5.2l8 2.4z"
                fill="#1a73e8"
              />
            </g>
          </svg>
        </div>

        <h1 className="home-hero__title">
          Compare and book cheap flights with ease
        </h1>
        <p className="home-hero__subtitle">
          Discover nonstop flight routes, connection hubs, and verified airline schedules worldwide.
        </p>

        <FlightSearchBar currentHub={currentHub} onSelectHub={onSelectHub} />
      </div>
    </section>
  );
}
