import type { CityInternalLinkGroup } from "../domain/models";

/**
 * Projects the `change_source_city` internal-link cluster into alternate
 * departure city cards.
 */
export function CityAlternateOriginsSection({
  cityName,
  groups,
}: {
  cityName: string;
  groups: readonly CityInternalLinkGroup[];
}) {
  const links = groups
    .filter((group) => group.cluster === "change_source_city")
    .flatMap((group) => group.links);

  if (links.length === 0) return null;

  return (
    <section className="city-alternate-origins">
      <div className="section-heading section-heading--center">
        <div>
          <h2>
            Not in <em>{cityName}?</em>
          </h2>
          <p>Explore direct flights from other regional travel cities.</p>
        </div>
      </div>
      <ul>
        {links.slice(0, 6).map((link) => (
          <li key={link.path}>
            <a href={link.path}>
              <span>{formatCityName(link.anchorText)}</span>
              <small>{link.secondaryText}</small>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatCityName(value: string): string {
  return value
    .replace(/^direct flights from\s+/i, "")
    .replace(/^flights from\s+/i, "")
    .replace(/\s+flights$/i, "")
    .trim();
}
