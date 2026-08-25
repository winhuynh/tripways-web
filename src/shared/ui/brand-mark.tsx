import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = Readonly<{
  className?: string;
}>;

/**
 * Renders the shared Tripways home link and visual brand mark.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Link
      aria-label="Tripways"
      className={["editorial-brand", className].filter(Boolean).join(" ")}
      href="/"
    >
      <Image
        alt="Tripways"
        height={32}
        src="/assets/tripways-logo.png"
        width={149}
        priority
      />
      <span className="sr-only">TRIPWAYS</span>
    </Link>
  );
}
