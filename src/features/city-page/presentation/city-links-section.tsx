import type { CityInternalLinkGroup } from "../domain/models";

export function CityLinksSection({
  groups,
}: {
  groups: readonly CityInternalLinkGroup[];
}) {
  return (
    <section className="link-clusters">
      {groups.map((group) => (
        <div key={group.cluster}>
          <h2>{formatCluster(group.cluster)}</h2>
          <ul>
            {group.links.map((link) => (
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
