"use client";

import { useState } from "react";
import {
  getAirlineDisplay,
  getAirlineLogoUrl,
} from "@/features/route-search/domain/route-filter-labels";

export type AirlineLogoProps = Readonly<{
  iata: string;
  name?: string;
  size?: number;
  className?: string;
}>;

/**
 * Renders a single airline logo using the Cloudflare Edge-cached proxy route.
 * Automatically falls back to a typographic IATA badge on network or image error.
 */
export function AirlineLogo({
  iata,
  name,
  size = 24,
  className = "",
}: AirlineLogoProps) {
  const [hasError, setHasError] = useState(false);
  const normalized = (iata ?? "").trim().toUpperCase();

  // If code is missing or error occurred, render fallback badge
  if (hasError || !normalized) {
    return (
      <span
        aria-label={name || normalized || "Airline"}
        className={`inline-flex items-center justify-center font-mono font-bold uppercase rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 select-none ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(9, Math.floor(size * 0.42)),
          lineHeight: 1,
          flexShrink: 0,
        }}
        title={name || normalized}
      >
        {normalized.slice(0, 2) || "✈"}
      </span>
    );
  }

  const logoUrl = getAirlineLogoUrl(normalized);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={name || `${normalized} logo`}
      className={`inline-block object-contain rounded select-none ${className}`}
      height={size}
      loading="lazy"
      onError={() => setHasError(true)}
      src={logoUrl}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
      }}
      title={name || normalized}
      width={size}
    />
  );
}

export type AirlineBadgeGroupProps = Readonly<{
  airlines: readonly string[];
  size?: number;
  maxLogos?: number;
  showNames?: boolean;
  className?: string;
  textClassName?: string;
  fallbackText?: string;
}>;

/**
 * Shared component to render a unified group of airline logos and textual names.
 * Ensures consistent appearance, tooltips, and responsive layout across all pages.
 */
export function AirlineBadgeGroup({
  airlines,
  size = 18,
  maxLogos = 3,
  showNames = true,
  className = "",
  textClassName = "",
  fallbackText = "Scheduled service",
}: AirlineBadgeGroupProps) {
  const codes = Array.from(
    new Set(
      (airlines ?? [])
        .map((a) => (a || "").trim().toUpperCase())
        .filter((a) => a.length > 0)
    )
  );

  const airlineNames = codes.map(getAirlineDisplay).join(", ");
  const displayedCodes = codes.slice(0, maxLogos);
  const remainingCount = codes.length - displayedCodes.length;

  return (
    <div
      className={["airline-badge-group", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        flexWrap: "wrap",
        verticalAlign: "middle",
      }}
    >
      {displayedCodes.length > 0 ? (
        <div
          className="airline-badge-group__logos"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          {displayedCodes.map((code) => (
            <AirlineLogo key={code} iata={code} size={size} />
          ))}
          {remainingCount > 0 ? (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                fontWeight: 600,
              }}
              title={`+${remainingCount} more airline${remainingCount > 1 ? "s" : ""}`}
            >
              +{remainingCount}
            </span>
          ) : null}
        </div>
      ) : null}
      {showNames ? (
        <span
          className={textClassName}
          title={airlineNames || fallbackText}
        >
          {airlineNames || fallbackText}
        </span>
      ) : null}
    </div>
  );
}
