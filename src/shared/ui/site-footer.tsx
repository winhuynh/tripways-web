import Link from "next/link";

import { BrandMark } from "./brand-mark";

/**
 * Renders the shared two-row site footer.
 */
export function SiteFooter() {
  return (
    <footer aria-label="Footer navigation" className="editorial-site-footer">
      <div className="editorial-site-footer__brand">
        <BrandMark />
      </div>

      <div className="editorial-site-footer__legal">
        <p>© 2026 Tripways. All rights reserved.</p>
        <nav aria-label="Legal navigation">
          <Link href="/about">About</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookie Policy</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
