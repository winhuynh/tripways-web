export type PriceEstimate =
  | Readonly<{
      state: "available";
      priceMin: number;
      priceMax: number;
      currencyCode: string;
    }>
  | Readonly<{ state: "unavailable"; reason: string }>;

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder}m`;
  return `${hours}h ${String(remainder).padStart(2, "0")}m`;
}

export function formatPriceEstimate(price: PriceEstimate): string {
  if (price.state === "unavailable") return "Fare unavailable";
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: price.currencyCode,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(price.priceMin)}–${formatter.format(price.priceMax)}`;
}
