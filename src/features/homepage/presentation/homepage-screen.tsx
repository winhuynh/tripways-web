"use client";

import {
  DEFAULT_ORIGIN_HUB,
  type HubAirport,
} from "../domain/homepage-routes-data";
import { useClientIpLocation } from "./use-client-ip-location";
import { HomepageHero } from "./homepage-hero";
import { HomepageMap } from "./homepage-map";
import { PopularRoutesSection } from "./popular-routes-section";
import { PopularCitiesSection } from "./popular-cities-section";
import { ValuePillarsSection } from "./value-pillars-section";
import { TravelAdvisoryNotice } from "./travel-advisory-notice";
import "./homepage.css";

type HomepageScreenProps = {
  initialHub?: HubAirport;
};

/**
 * Homepage screen orchestrating presentation sections and active origin hub state.
 */
export function HomepageScreen({
  initialHub = DEFAULT_ORIGIN_HUB,
}: HomepageScreenProps) {
  const { currentHub, setCurrentHub } = useClientIpLocation(initialHub);

  return (
    <main className="homepage-main">
      {/* 1. Hero & Search Section */}
      <HomepageHero
        currentHub={currentHub}
        onSelectHub={setCurrentHub}
      />

      {/* 2. Interactive Map Section (Focus on user IP / selected location) */}
      <HomepageMap currentHub={currentHub} />

      {/* 3. Advertisement Placeholder */}
      <aside className="home-ad-section" aria-label="Advertisement">
        <div className="pseo-container">
          <div className="home-ad-frame">
            <p className="home-ad-label">ADVERTISEMENT</p>
          </div>
        </div>
      </aside>

      {/* 4. Popular Nonstop Routes Section */}
      <PopularRoutesSection />

      {/* 5. Popular Cities Section */}
      <PopularCitiesSection onSelectCity={setCurrentHub} />

      {/* 6. Value Pillars Section */}
      <ValuePillarsSection />

      {/* 7. Travel Advisory Notice Banner */}
      <TravelAdvisoryNotice />
    </main>
  );
}
