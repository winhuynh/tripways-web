import Link from "next/link";
import { formatDuration, formatPriceEstimate, type PriceEstimate } from "@/shared/domain/route-values";
import { getAirlineDisplay, getAirportDisplay } from "@/features/route-search/domain/route-filter-labels";

export type FlightOptionData = Readonly<{
  id: string;
  from: string;
  fromAirportName?: string;
  to: string;
  toAirportName?: string;
  stops: number;
  connectionAirport?: string | null;
  durationMinutes: number;
  airlines: readonly string[];
  frequencyWeekly?: number | null;
  price?:
    | PriceEstimate
    | {
        amount: number;
        currency: string;
        cabin?: string;
        fareType?: "estimated" | "live";
        validUntil?: string | null;
      }
    | null;
  routePath?: string | null;
  operatingDays?: readonly string[];
}>;

function formatOptionPrice(price: FlightOptionData["price"]): string | null {
  if (!price) return null;
  if ("state" in price) {
    if (price.state === "unavailable") return null;
    return formatPriceEstimate(price);
  }
  if (typeof price.amount === "number") {
    const currency = price.currency || "GBP";
    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(price.amount);
    } catch {
      return `${currency} ${price.amount}`;
    }
  }
  return null;
}

export type FlightOptionCardProps = Readonly<{
  option: FlightOptionData;
  includePrice?: boolean;
  className?: string;
}>;

export function FlightOptionCard({
  option,
  includePrice = true,
  className = "",
}: FlightOptionCardProps) {
  const fromIata = option.from.toUpperCase();
  const toIata = option.to.toUpperCase();
  const fromDisplay = option.fromAirportName ?? getAirportDisplay(option.from);
  const toDisplay = option.toAirportName ?? getAirportDisplay(option.to);
  const airlineNames = option.airlines.map(getAirlineDisplay).join(", ");
  const stopLabel =
    option.stops === 0
      ? "NONSTOP"
      : option.connectionAirport
        ? `1 STOP (${option.connectionAirport.toUpperCase()})`
        : `${option.stops} STOP${option.stops === 1 ? "" : "S"}`;

  const ctaText = `View ${fromIata} → ${toIata}`;

  return (
    <article className={`flight-option-card ${className}`}>
      {/* 1. Origin Airport */}
      <div className="flight-option-card__origin">
        <strong className="flight-option-card__iata">{fromIata}</strong>
        <span className="flight-option-card__city">{fromDisplay}</span>
      </div>

      {/* 2. Middle Visual Flight Path */}
      <div className="flight-option-card__path">
        <div className="flight-option-card__path-header">
          <span
            className={`flight-option-card__stop-badge ${
              option.stops === 0 ? "flight-option-card__stop-badge--nonstop" : ""
            }`}
          >
            {stopLabel}
          </span>
          <span className="flight-option-card__duration">
            {formatDuration(option.durationMinutes)}
          </span>
        </div>
        <div className="flight-option-card__line-graphic" aria-hidden="true">
          <span className="flight-option-card__line-dot flight-option-card__line-dot--start" />
          <span className="flight-option-card__line-track" />
          {option.stops > 0 && option.connectionAirport ? (
            <span className="flight-option-card__transit-pill" title={`Layover at ${option.connectionAirport.toUpperCase()}`}>
              {option.connectionAirport.toUpperCase()}
            </span>
          ) : (
            <svg
              className="flight-option-card__plane-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          )}
          <span className="flight-option-card__line-dot flight-option-card__line-dot--end" />
        </div>
      </div>

      {/* 3. Destination Airport */}
      <div className="flight-option-card__destination">
        <strong className="flight-option-card__iata">{toIata}</strong>
        <span className="flight-option-card__city">{toDisplay}</span>
      </div>

      {/* 4. Meta & Pricing Block */}
      <div className="flight-option-card__meta">
        <div className="flight-option-card__operating">
          {option.frequencyWeekly ? (
            <span className="flight-option-card__freq">
              {option.frequencyWeekly} WEEKLY FLIGHTS
            </span>
          ) : (
            <span className="flight-option-card__freq">OPERATED BY</span>
          )}
          <span className="flight-option-card__airlines" title={airlineNames}>
            {airlineNames || "Scheduled service"}
          </span>
        </div>

        {includePrice && formatOptionPrice(option.price) ? (
          <div className="flight-option-card__price-box">
            <strong className="flight-option-card__amount">
              {formatOptionPrice(option.price)}
            </strong>
            <span className="flight-option-card__price-label">
              ESTIMATED ONE-WAY
            </span>
            <span className="flight-option-card__price-sub">
              {("cabin" in (option.price ?? {}) ? (option.price as { cabin?: string }).cabin : undefined) ?? "Economy"}
            </span>
          </div>
        ) : null}

        <div className="flight-option-card__actions">
          {option.routePath ? (
            <>
              <Link
                href={option.routePath}
                className="flight-option-card__cta flight-option-card__cta--primary"
                aria-label={`Check live fares for ${fromIata} to ${toIata}`}
              >
                Check live fares ↗
              </Link>
              <Link
                href={option.routePath}
                className="flight-option-card__cta flight-option-card__cta--secondary"
                aria-label={`View flights from ${fromIata} to ${toIata}`}
              >
                {ctaText}
              </Link>
            </>
          ) : (
            <span className="flight-option-card__cta flight-option-card__cta--disabled">
              {ctaText}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
