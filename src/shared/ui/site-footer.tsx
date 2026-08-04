import Link from "next/link";

import { BrandMark } from "./brand-mark";

/**
 * Renders only retained legal navigation while product pages are rebuilt.
 */
export function SiteFooter() {
  return (
    <footer aria-label="Footer navigation" className="editorial-site-footer">
      <div className="editorial-site-footer__grid">
        <div className="editorial-site-footer__about">
          <BrandMark />
          <p>Tripways legal information.</p>
        </div>
      </div>

      <div className="editorial-site-footer__legal">
        <p>© 2026 Tripways.</p>
        <nav aria-label="Legal navigation">
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
