import { PageHero } from "@/shared/ui";
import type { HomepageModel } from "../domain/homepage-model";
import "./homepage.css";

export function HomepageScreen({ model }: { model: HomepageModel }) {
  return (
    <main className="pseo-page homepage">
      <section className="home-hero">
        <div className="pseo-container">
          <PageHero
            title="Find direct flights from airports worldwide"
            intro="Explore Tripways coverage and start with a city or airport guide."
          />
        </div>
      </section>
      <div className="pseo-container">
        <section className="pseo-section home-values" aria-label="Tripways coverage">
          <article>
            <strong>{model.originCityCount}</strong>
            <span> cities with direct routes</span>
          </article>
          <article>
            <strong>{model.originAirportCount}</strong>
            <span> departure airports</span>
          </article>
          <article>
            <strong>{model.publishedDirectRouteCount}</strong>
            <span> published direct route guides</span>
          </article>
        </section>
        <aside className="home-disclaimer">
          Coverage reflects the current published Tripways dataset, not live availability.
        </aside>
      </div>
    </main>
  );
}
