import { BrandMark } from "./brand-mark";

/**
 * Renders the shared logo-only site header.
 */
export function SiteHeader() {
  return (
    <header className="editorial-site-header">
      <div className="editorial-site-header__inner">
        <BrandMark />
      </div>
    </header>
  );
}
