import Link from "next/link";

export function Breadcrumbs({ items }: { items: ReadonlyArray<{ label: string; href?: string }> }) {
  return (
    <nav className="pseo-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item) => (
          <li key={`${item.href ?? "current"}:${item.label}`}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
