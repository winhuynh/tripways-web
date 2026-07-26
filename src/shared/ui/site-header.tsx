import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "./brand-mark";

const navigation = [
  { label: "Explore", href: "/" },
  { label: "Map", href: "/#global-route-map" },
  { label: "Airports", href: "/flights-from/bangkok#airports" },
  { label: "Cities", href: "/flights-from/bangkok" },
  { label: "About", href: "/#about" },
] as const;

/**
 * Renders the shared primary site navigation and account entry point.
 */
export function SiteHeader() {
  return (
    <header className="editorial-site-header">
      <div className="editorial-site-header__inner">
        <BrandMark />
        <nav aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label.toUpperCase()}
            </Link>
          ))}
        </nav>
        <div className="editorial-site-header__account">
          <Link href="/#newsletter">SIGN UP</Link>
          <Image
            alt="Tripways member"
            height={32}
            src="/figma/shared/profile-avatar.jpg"
            width={32}
          />
        </div>
      </div>
    </header>
  );
}
