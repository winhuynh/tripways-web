import type { ReactNode } from "react";

export type FactBadgeIcon = "plane" | "clock" | "calendar" | "route" | "pin" | "tag";

export type FactBadgeItem = Readonly<{
  icon?: FactBadgeIcon | ReactNode;
  label: string;
  highlight?: boolean;
}>;

export type FactBadgesBarProps = Readonly<{
  items: readonly FactBadgeItem[];
  verifiedDate?: string | null;
  className?: string;
}>;

function renderIcon(icon: FactBadgeIcon | ReactNode) {
  if (typeof icon !== "string") return icon;

  switch (icon) {
    case "plane":
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
        </svg>
      );
    case "clock":
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "calendar":
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "route":
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H5a3 3 0 0 1 0-6h13" />
          <polyline points="15 1 18 4 15 7" />
        </svg>
      );
    case "pin":
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

export function FactBadgesBar({
  items,
  verifiedDate,
  className = "",
}: FactBadgesBarProps) {
  if (items.length === 0 && !verifiedDate) return null;

  return (
    <div className={`fact-badges-bar ${className}`} role="region" aria-label="Key route facts">
      <div className="fact-badges-bar__list">
        {items.map((item, idx) => (
          <span
            key={`${idx}:${item.label}`}
            className={`fact-badge-pill ${item.highlight ? "fact-badge-pill--highlight" : ""}`}
          >
            {item.icon ? (
              <span className="fact-badge-pill__icon">{renderIcon(item.icon)}</span>
            ) : null}
            <span className="fact-badge-pill__text">{item.label}</span>
          </span>
        ))}
      </div>

      {verifiedDate ? (
        <div className="fact-badges-bar__verified">
          <span>Data verified {verifiedDate}</span>
        </div>
      ) : null}
    </div>
  );
}
