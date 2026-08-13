"use client";

import { useState } from "react";
import type { ObservedPrice } from "../domain/route-page-model";

export function ObservedPriceCard({ price }: { price: ObservedPrice }) {
  const [state, setState] = useState<"idle"|"loading"|"error">("idle");
  const amount = new Intl.NumberFormat("en", { style: "currency", currency: price.currencyCode, maximumFractionDigits: 0 }).format(price.amount);
  async function checkPrice() {
    setState("loading");
    try {
      const response = await fetch("/api/flight-affiliate-handoff", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ observationRef: price.reference }) });
      const payload: unknown = await response.json();
      const url = typeof payload === "object" && payload !== null && !Array.isArray(payload) ? (payload as { url?: unknown }).url : null;
      if (!response.ok || typeof url !== "string" || !url.startsWith("https://www.aviasales.com/")) throw new Error("unavailable");
      window.location.assign(url);
    } catch { setState("error"); }
  }
  return <article className="observed-price-card">
    <p className="pseo-eyebrow">Recently observed from</p><strong>{amount}</strong>
    <p>{price.departureDate ? `Departure ${price.departureDate}` : "Flexible departure date"}</p>
    <p className="observed-price-card__note">Cached price, not live availability. Final price is confirmed by Aviasales.</p>
    <button type="button" onClick={checkPrice} disabled={state==="loading"}>{state==="loading"?"Checking…":"Check latest price"}</button>
    {state==="error"?<p role="status">Price check is temporarily unavailable. Please try again.</p>:null}
  </article>;
}
