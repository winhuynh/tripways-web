"use client";

import { useState } from "react";

export type AirlineLogoProps = Readonly<{
  iata: string;
  name?: string;
  size?: number;
  className?: string;
}>;

/**
 * Renders an airline logo using Travelpayouts / Aviasales Global CDN.
 * Automatically falls back to a clean typographic IATA badge on network or image error.
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

  // Internal edge-cached proxy route (cached on Cloudflare CDN for 1 year)
  const logoUrl = `/api/airlines/${normalized}/logo`;

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
