import Link from "next/link";
import { formatDuration, formatPriceEstimate } from "@/shared/domain/route-values";
import type { RouteSearchModel } from "../domain/route-search-model";
import type { RouteFilterValues } from "../domain/route-filter";
import { getAirlineDisplay, getAirportDisplay } from "../domain/route-filter-labels";
import { ActiveFilterChips } from "./active-filter-chips";

type RouteResultsProps = Readonly<{
  model: RouteSearchModel;
  includePrice?: boolean;
  filterValues?: RouteFilterValues;
  clearHref?: string;
}>;

export function RouteResults({
  model,
  includePrice = true,
  filterValues,
  clearHref,
}: RouteResultsProps) {
  return (
    <div className="route-results">
      {filterValues && clearHref ? (
        <ActiveFilterChips values={filterValues} clearHref={clearHref} />
      ) : null}

      <p className="route-results__summary">
        Showing {model.options.length} of {model.total} flight options
      </p>

      {model.options.length === 0 ? (
        <div className="route-results__empty">
          <p>No verified routes match these filters.</p>
          {clearHref ? (
            <p>
              <Link href={clearHref} className="route-results__clear-link">
                Clear all filters to view all routes
              </Link>
            </p>
          ) : null}
        </div>
      ) : (
        <ul className="route-results__list">
          {model.options.map((option) => {
            const fromDisplay = getAirportDisplay(option.from);
            const toDisplay = getAirportDisplay(option.to);
            const airlineNames = option.airlines.map(getAirlineDisplay).join(", ");

            return (
              <li key={option.id} className="route-results__item">
                <div className="route-results__route">
                  <strong>
                    {fromDisplay} → {toDisplay}
                  </strong>
                  <span className="route-results__stops">
                    {option.stops === 0
                      ? "Nonstop"
                      : `${option.stops} stop${option.stops === 1 ? "" : "s"}`}
                  </span>
                </div>
                <div className="route-results__details">
                  <span>{airlineNames}</span>
                  <span>{formatDuration(option.durationMinutes)}</span>
                  {includePrice ? (
                    <span>{formatPriceEstimate(option.price)}</span>
                  ) : null}
                  {option.routePath ? (
                    <Link href={option.routePath} className="route-results__cta">
                      View route
                    </Link>
                  ) : (
                    <span className="route-results__unavailable">
                      Route guide unavailable
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
