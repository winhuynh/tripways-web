import Link from "next/link";
import { formatDuration, formatPriceEstimate } from "@/shared/domain/route-values";
import type { RouteSearchModel } from "../domain/route-search-model";

export function RouteResults({ model, includePrice = true }: { model: RouteSearchModel; includePrice?: boolean }) {
  return <div className="route-results">
    <p>Showing {model.options.length} of {model.total} flight options</p>
    {model.options.length === 0 ? <p>No verified routes match these filters.</p> : <ul>{model.options.map((option) => <li key={option.id}>
      <div><strong>{option.from} → {option.to}</strong><span>{option.stops === 0 ? "Nonstop" : `${option.stops} stop${option.stops === 1 ? "" : "s"}`}</span></div>
      <div><span>{option.airlines.join(", ")}</span><span>{formatDuration(option.durationMinutes)}</span>{includePrice ? <span>{formatPriceEstimate(option.price)}</span> : null}{option.routePath ? <Link href={option.routePath}>View route</Link> : <span>Route guide unavailable</span>}</div>
    </li>)}</ul>}
  </div>;
}
