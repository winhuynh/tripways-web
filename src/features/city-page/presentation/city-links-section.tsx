import type { CityInternalLinkGroup } from "../domain/models";
import { CityAlternateOriginsSection } from "./city-alternate-origins-section";

/**
 * Projects semantic internal-link clusters into crawlable route directories
 * or alternate-origin cards.
 */
export function CityLinksSection({
  cityName,
  groups,
  variant = "directories",
}: {
  cityName?: string;
  groups: readonly CityInternalLinkGroup[];
  variant?: "directories" | "alternate-origins";
}) {
  if (variant === "alternate-origins" && cityName) {
    return <CityAlternateOriginsSection cityName={cityName} groups={groups} />;
  }

  return (
    <section aria-label="City route directories" className="link-clusters">
      {groups
        .filter((group) => group.cluster !== "change_source_city")
        .slice(0, 3)
        .map((group) => (
        <div key={group.cluster}>
          <h2>{formatCluster(group.cluster)}</h2>
          <ul>
            {group.links.slice(0, 6).map((link) => (
              <li key={`${group.cluster}-${link.path}`}>
                <a href={link.path}>{link.anchorText}</a>
                {link.secondaryText && <small>{link.secondaryText}</small>}
              </li>
            ))}
          </ul>
        </div>
        ))}
    </section>
  );
}

/**
 * Renders a compact curated collection from the highest-priority internal
 * links when that optional section is used.
 */
export function CollectionsSection({
  groups,
}: {
  groups: readonly CityInternalLinkGroup[];
}) {
  const links = groups.flatMap((group) => group.links).slice(0, 4);
  if (links.length === 0) return null;
  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Curated discovery</p>
          <h2>Explore collections</h2>
        </div>
      </div>
      <div className="collection-grid">
        {links.map((link, index) => (
          <a className={`collection-card collection-card--${index + 1}`} href={link.path} key={link.path}>
            <span>{link.anchorText}</span>
            <small>{link.secondaryText ?? "Explore direct routes"}</small>
          </a>
        ))}
      </div>
    </section>
  );
}

function formatCluster(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
