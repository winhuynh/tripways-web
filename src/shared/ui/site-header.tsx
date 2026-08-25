import { BrandMark } from "./brand-mark";
import { RouteSwitcher } from "./route-switcher";

/**
 * Renders the shared site header and canonical route navigation control.
 */
export function SiteHeader() {
  return (
    <header className="editorial-site-header">
      <div className="editorial-site-header__inner">
        <BrandMark />
        <RouteSwitcher />
      </div>
    </header>
  );
}
