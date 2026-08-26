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
        <h1 className="home-hero__title">
          Compare and book cheap flights with ease
        </h1>

        <FlightSearchBar currentHub={currentHub} onSelectHub={onSelectHub} />
      </div>
    </section>
  );
}
