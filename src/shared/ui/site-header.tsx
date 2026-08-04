import Link from "next/link";

import { BrandMark } from "./brand-mark";

/**
 * Renders the temporary legal-only navigation while product pages are rebuilt.
 */
export function SiteHeader() {
  return (
    <header className="editorial-site-header">
      <div className="editorial-site-header__inner">
        <BrandMark />
        <nav aria-label="Primary navigation">
          <Link href="/terms">TERMS</Link>
        </nav>
      </div>
    </header>
  );
}
