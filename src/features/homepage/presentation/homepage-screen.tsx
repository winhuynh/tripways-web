"use client";

import {
  DEFAULT_ORIGIN_HUB,
  type HubAirport,
} from "../domain/homepage-routes-data";
import { useClientIpLocation } from "./use-client-ip-location";
import { HomepageHero } from "./homepage-hero";
import { HomepageMap } from "./homepage-map";
import { LocalHubDestinationsSection } from "./local-hub-destinations-section";
import { PopularRoutesSection } from "./popular-routes-section";
import { RouteToolsSection } from "./route-tools-section";
import { GlobalDirectoryMatrixSection } from "./global-directory-matrix-section";
import { HomepageFaqSection } from "./homepage-faq-section";
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

      {/* 3. Direct destinations from user's active hub */}
      <LocalHubDestinationsSection currentHub={currentHub} />

      {/* 4. Trending Global Routes */}
      <PopularRoutesSection />

      {/* 5. Useful Route Planning Tools (Google Flights style) */}
      <RouteToolsSection />

      {/* 6. Global Directory Matrix (pSEO Crawl Equity) */}
      <GlobalDirectoryMatrixSection />

      {/* 10. Frequently Asked Questions with Schema.org JSON-LD */}
      <HomepageFaqSection />

      {/* 11. Travel Advisory & Data Transparency Notice Banner */}
      <TravelAdvisoryNotice />
    </main>
  );
}
