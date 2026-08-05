import Link from "next/link";

export function InternalLinkGroups({ groups }: { groups: ReadonlyArray<{ title: string; links: ReadonlyArray<{ label: string; href: string; secondaryText?: string }> }> }) {
  if (groups.length === 0) return null;
  return (
    <section className="pseo-section" aria-labelledby="related-heading">
      <h2 id="related-heading">Explore related flight networks</h2>
      <div className="pseo-link-groups">
        {groups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>{group.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link>{link.secondaryText ? <span>{link.secondaryText}</span> : null}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
