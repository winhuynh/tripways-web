"use client";

import { usePathname } from "next/navigation";
import { FlightSearchBar } from "@/features/homepage/presentation/flight-search-bar";
import { BrandMark } from "./brand-mark";

/**
 * Renders the shared site header and canonical route search control.
 * On homepage ("/"), the compact search bar is omitted to avoid duplicate search inputs.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <header className="editorial-site-header">
      <div className="editorial-site-header__inner">
        <BrandMark />
        {!isHomepage && <FlightSearchBar variant="compact" />}
      </div>
    </header>
  );
}
