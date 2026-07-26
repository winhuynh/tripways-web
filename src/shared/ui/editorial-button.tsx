import Link from "next/link";
import type { ReactNode } from "react";

type EditorialButtonProps = Readonly<{
  children: ReactNode;
  href: string;
  tone?: "primary" | "accent";
}>;

/**
 * Renders the shared editorial call-to-action link with a consistent tone and
 * directional affordance.
 */
export function EditorialButton({
  children,
  href,
  tone = "primary",
}: EditorialButtonProps) {
  return (
    <Link
      className={`editorial-button editorial-button--${tone}`}
      href={href}
    >
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
