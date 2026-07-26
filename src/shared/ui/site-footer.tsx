import Link from "next/link";

import { BrandMark } from "./brand-mark";

const directoryLinks = [
  { label: "Airports", href: "/flights-from/bangkok#airports" },
  { label: "Cities", href: "/flights-from/bangkok" },
  { label: "Countries", href: "/flights-from/bangkok#destinations" },
  { label: "Airlines", href: "/flights-from/bangkok#airlines" },
] as const;

const ecosystemLinks = [
  { label: "Route map", href: "/#global-route-map" },
  { label: "Travel guides", href: "/flights-from/bangkok#faq" },
  { label: "City insights", href: "/flights-from/bangkok#insights" },
  { label: "Route planner", href: "/flights-from/bangkok#route-search" },
] as const;

/**
 * Renders the shared directory links, newsletter boundary, and legal
 * navigation used across all public pages.
 */
export function SiteFooter() {
  return (
    <footer
      aria-label="Footer navigation"
      className="editorial-site-footer"
    >
      <div className="editorial-site-footer__grid">
        <div className="editorial-site-footer__about">
          <BrandMark />
          <p>
            The world&apos;s detailed direct-flight journal, designed for
            curious travellers.
          </p>
        </div>

        <FooterLinkGroup label="Directories" links={directoryLinks} />
        <FooterLinkGroup label="Ecosystem" links={ecosystemLinks} />

        <form
          action="#newsletter"
          aria-label="Newsletter signup"
          className="editorial-newsletter"
          id="newsletter"
        >
          <strong>NEWSLETTER</strong>
          <p>Monthly data insights and route expansions direct to your inbox.</p>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <div>
            <input
              autoComplete="email"
              id="newsletter-email"
              name="email"
              placeholder="EMAIL ADDRESS"
              type="email"
            />
            <button aria-label="Subscribe to newsletter" type="submit">
              →
            </button>
          </div>
        </form>
      </div>

      <div className="editorial-site-footer__legal">
        <p>© 2026 Tripways Aviation Hub. Precision in global logistics.</p>
        <nav aria-label="Legal navigation">
          <a href="#privacy">Privacy</a>
          <a href="#technical">Technical</a>
          <a href="#terms">Terms</a>
        </nav>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  label,
  links,
}: Readonly<{
  label: string;
  links: readonly Readonly<{ href: string; label: string }>[];
}>) {
  return (
    <nav aria-label={`${label} footer links`}>
      <strong>{label.toUpperCase()}</strong>
      {links.map((link) => (
        <Link href={link.href} key={link.label}>
          {link.label.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
