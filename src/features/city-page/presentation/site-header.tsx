import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <Link className="brand" href="/">
          <span aria-hidden="true">✈</span> Tripways
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/flights-from/bangkok">Flights</Link>
          <a href="#airports">Airports</a>
          <a href="#faq">Travel guide</a>
        </nav>
        <a className="header-cta" href="#route-search">
          Search routes
        </a>
      </div>
    </header>
  );
}
