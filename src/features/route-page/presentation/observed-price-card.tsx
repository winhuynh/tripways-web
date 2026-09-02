"use client";

import { useState } from "react";
import type { ObservedPrice } from "../domain/route-page-model";

export function ObservedPriceCard({ price }: { price: ObservedPrice }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const amount = new Intl.NumberFormat("en", {
    style: "currency",
    currency: price.currencyCode,
    maximumFractionDigits: 0,
  }).format(price.amount);

  async function checkPrice() {
    setState("loading");
    try {
      const response = await fetch("/api/flight-affiliate-handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ observationRef: price.reference }),
      });
      const payload: unknown = await response.json();
      const url =
        typeof payload === "object" && payload !== null && !Array.isArray(payload)
          ? (payload as { url?: unknown }).url
          : null;
      if (!response.ok || typeof url !== "string" || !url.startsWith("https://www.aviasales.com/")) {
        throw new Error("unavailable");
      }
      window.location.assign(url);
    } catch {
      setState("error");
    }
  }

  return (
    <article className="observed-price-card">
      <p className="pseo-eyebrow">Recently observed from</p>
      <strong>{amount}</strong>
      <p>{price.departureDate ? `Departure ${price.departureDate}` : "Flexible departure date"}</p>
      <p className="observed-price-card__note">
        Cached price, not live availability. Final price is confirmed by Aviasales.
      </p>
      <button type="button" onClick={checkPrice} disabled={state === "loading"}>
        {state === "loading" ? "Checking…" : "Check latest price"}
      </button>
      {state === "error" ? (
        <p role="status">Price check is temporarily unavailable. Please try again.</p>
      ) : null}
    </article>
  );
}

export function RouteAffiliateFallbackBanner({
  originIata,
  destIata,
  originName,
  destName,
}: {
  originIata: string;
  destIata: string;
  originName: string;
  destName: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handleSearch() {
    setState("loading");
    try {
      const response = await fetch("/api/flight-affiliate-handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          originIata: originIata.toUpperCase(),
          destIata: destIata.toUpperCase(),
        }),
      });
      const payload: unknown = await response.json();
      const url =
        typeof payload === "object" && payload !== null && !Array.isArray(payload)
          ? (payload as { url?: unknown }).url
          : null;
      if (!response.ok || typeof url !== "string" || !url.startsWith("https://www.aviasales.com/")) {
        throw new Error("unavailable");
      }
      window.location.assign(url);
    } catch {
      setState("error");
    }
  }

  return (
    <div className="route-affiliate-fallback-banner" style={{
      margin: "1.5rem 0",
      padding: "1.25rem 1.5rem",
      backgroundColor: "var(--color-bg-subtle, #f8fafc)",
      border: "1px solid var(--color-border-subtle, #e2e8f0)",
      borderRadius: "0.5rem",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem"
    }}>
      <div>
        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: 600 }}>
          Looking for live flight prices from {originName} to {destName}?
        </h3>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted, #64748b)" }}>
          Check real-time availability and fares across all partner airlines on Aviasales.
        </p>
      </div>
      <button
        type="button"
        onClick={handleSearch}
        disabled={state === "loading"}
        style={{
          padding: "0.625rem 1.25rem",
          backgroundColor: "#005cb9",
          color: "#ffffff",
          border: "none",
          borderRadius: "0.375rem",
          fontWeight: 600,
          cursor: state === "loading" ? "not-allowed" : "pointer"
        }}
      >
        {state === "loading" ? "Searching…" : "Check Live Fares ↗"}
      </button>
      {state === "error" ? (
        <p role="status" style={{ width: "100%", margin: 0, color: "#dc2626", fontSize: "0.875rem" }}>
          Search is temporarily unavailable. Please try again later.
        </p>
      ) : null}
    </div>
  );
}
