"use client";

import { usePathname } from "next/navigation";
import { BrandMark } from "./brand-mark";
import { RouteSwitcher } from "./route-switcher";

/**
 * Renders the shared site header and canonical route navigation control.
 * On homepage ("/"), the compact route switcher is omitted to avoid duplicate search inputs.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <header className="editorial-site-header">
      <div className="editorial-site-header__inner">
        <BrandMark />
        {!isHomepage && <RouteSwitcher />}
      </div>
    </header>
  );
}
