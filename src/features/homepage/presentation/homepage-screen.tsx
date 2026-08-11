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
            <strong>{model.cityCount}</strong>
            <span> cities</span>
          </article>
          <article>
            <strong>{model.airportCount}</strong>
            <span> airports</span>
          </article>
          <article>
            <strong>{model.directRouteCount}</strong>
            <span> direct routes</span>
          </article>
        </section>
        <aside className="home-disclaimer">
          Coverage reflects the current published Tripways dataset, not live availability.
        </aside>
      </div>
    </main>
  );
}
