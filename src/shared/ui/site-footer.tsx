import Link from "next/link";

import { BrandMark } from "./brand-mark";

/**
 * Renders the shared two-row site footer.
 */
export function SiteFooter() {
  return (
    <footer aria-label="Footer navigation" className="editorial-site-footer">
      <div className="editorial-site-footer__inner">
        <div className="editorial-site-footer__content">
          <div className="editorial-site-footer__brand">
            <BrandMark />
            <p className="editorial-site-footer__mission">
              Global flight route graph and nonstop destination discovery platform.
              Explore operated flight routes, hub connections, and schedules across worldwide airports.
            </p>
          </div>

          <div className="editorial-site-footer__columns">
            <div className="editorial-site-footer__col">
              <span className="editorial-site-footer__heading">Featured Hubs</span>
              <ul>
                <li><Link href="/flights-from/bangkok">Flights from Bangkok</Link></li>
                <li><Link href="/flights-from/singapore">Flights from Singapore</Link></li>
                <li><Link href="/flights-from/london">Flights from London</Link></li>
              </ul>
            </div>
            <div className="editorial-site-footer__col">
              <span className="editorial-site-footer__heading">Major Airports</span>
              <ul>
                <li><Link href="/airports/bkk">Bangkok Suvarnabhumi (BKK)</Link></li>
                <li><Link href="/airports/sin">Singapore Changi (SIN)</Link></li>
                <li><Link href="/airports/lhr">London Heathrow (LHR)</Link></li>
              </ul>
            </div>
          </div>
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
      </div>
    </footer>
  );
}
