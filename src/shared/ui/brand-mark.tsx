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
      aria-label="Tripways terms"
      className={["editorial-brand", className].filter(Boolean).join(" ")}
      href="/terms"
    >
      <Image
        alt=""
        aria-hidden="true"
        height={18}
        src="/figma/shared/brand-mark.svg"
        width={21}
      />
      <span>TRIPWAYS</span>
    </Link>
  );
}
