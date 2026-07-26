import { Suspense } from "react";

import { SiteFooter, SiteHeader } from "@/shared/ui";

import { getHomePageReadModel } from "../application/get-home-page-read-model";
import { HomeCorridors } from "./home-corridors";
import { HomeDirectories } from "./home-directories";
import { HomeHero } from "./home-hero";
import {
  HomeRouteMapFallback,
  HomeRouteMapSection,
} from "./home-route-map-section";
import { HomeValuePropositions } from "./home-value-propositions";

/**
 * Composes the server-rendered editorial homepage from its single static read
 * model. The route map keeps an independent Suspense boundary because it may
 * load route-discovery data after the surrounding editorial content.
 */
export function HomePage() {
  const readModel = getHomePageReadModel();

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <HomeHero hero={readModel.hero} issueLabel={readModel.issueLabel} />
        <section
          aria-labelledby="global-route-map-title"
          className="home-route-map"
          id="global-route-map"
        >
          <h2 className="sr-only" id="global-route-map-title">
            Global direct-route map
          </h2>
          <Suspense fallback={<HomeRouteMapFallback />}>
            <HomeRouteMapSection />
          </Suspense>
        </section>
        <HomeDirectories directories={readModel.directories} />
        <HomeCorridors
          corridors={readModel.corridors}
          story={readModel.corridorStory}
        />
        <HomeValuePropositions values={readModel.valuePropositions} />
      </main>
      <SiteFooter />
    </>
  );
}
