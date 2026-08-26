import type { ReactNode } from "react";

export type TravelServiceType =
  | "flights"
  | "transfers"
  | "hotels"
  | "esim"
  | "insurance"
  | "custom";

export type SponsoredServiceOffer = Readonly<{
  type?: TravelServiceType;
  title: string;
  href: string;
  icon?: ReactNode;
  description?: string;
}>;

export type SponsoredTravelServicesProps = Readonly<{
  offers?: readonly SponsoredServiceOffer[];
  destinationCity?: string;
  routeLabel?: string;
  disclosure?: string;
  className?: string;
}>;

function getDefaultIcon(type?: TravelServiceType) {
  switch (type) {
    case "flights":
      return (
        <svg
          width="20"
          height="20"
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
    case "transfers":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case "hotels":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 4v16" />
          <path d="M2 8h18a2 2 0 0 1 2 2v10" />
          <path d="M2 17h20" />
          <path d="M6 8v9" />
        </svg>
      );
    case "esim":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 10v4" />
          <path d="M9 12h6" />
        </svg>
      );
    case "insurance":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

const DEFAULT_OFFERS: readonly SponsoredServiceOffer[] = [
  { type: "flights", title: "Search flights", href: "#flights" },
  { type: "transfers", title: "Airport transfers", href: "#transfers" },
  { type: "hotels", title: "Hotels", href: "#hotels" },
  { type: "esim", title: "eSIM", href: "#esim" },
  { type: "insurance", title: "Travel insurance", href: "#insurance" },
];

export function SponsoredTravelServices({
  offers,
  destinationCity,
  routeLabel,
  disclosure = "Affiliate links · We may earn a commission",
  className = "",
}: SponsoredTravelServicesProps) {
  const displayOffers = offers && offers.length > 0 ? offers : DEFAULT_OFFERS;

  return (
    <section
      className={`sponsored-services pseo-section ${className}`}
      aria-labelledby="sponsored-services-heading"
    >
      <div className="sponsored-services__header">
        <h2 id="sponsored-services-heading" className="sponsored-services__title">
          Sponsored Travel Services
        </h2>
        <span className="sponsored-services__disclosure">{disclosure}</span>
      </div>

      <div className="sponsored-services__grid">
        {displayOffers.map((offer) => {
          const title =
            offer.type === "hotels" && destinationCity
              ? `${destinationCity} Hotels`
              : offer.title;

          return (
            <a
              key={`${offer.type ?? "offer"}:${offer.title}`}
              href={offer.href}
              className="sponsored-service-card"
              rel="sponsored nofollow"
              target="_blank"
            >
              <div className="sponsored-service-card__icon">
                {offer.icon ?? getDefaultIcon(offer.type)}
              </div>
              <strong className="sponsored-service-card__title">{title}</strong>
              {offer.description ? (
                <span className="sponsored-service-card__desc">
                  {offer.description}
                </span>
              ) : null}
            </a>
          );
        })}
      </div>

      {routeLabel ? (
        <p className="sponsored-services__note">
          These providers are selected for {routeLabel} journey. Terms and conditions apply.
        </p>
      ) : null}
    </section>
  );
}
