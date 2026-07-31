import Link from "next/link";

/**
 * Keeps the route-freshness warning consistent across public discovery pages.
 */
export function RouteInformationDisclaimer() {
  return (
    <aside className="route-information-disclaimer" role="note">
      <p>
        Route information is for planning reference only and may change. Verify
        current services and schedules with the airline or booking provider.
      </p>
      <Link href="/terms">Read the Terms</Link>
    </aside>
  );
}
