export type SharedMapDestination = Readonly<{
  city: string;
  citySlug: string;
  iata: string;
  airportName?: string;
  country?: string;
  countryName?: string;
  latitude: number;
  longitude: number;
  minDuration?: number;
  typicalDuration?: string;
  durationRange?: string;
  airlines?: readonly string[];
  frequency?: number | null;
  fareMin?: number;
  fareMax?: number;
  fareCurrency?: string;
  routePath: string;
  isTopRoute?: boolean;
}>;

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char] ?? char,
  );
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function sanitizeSafePath(path: string): string {
  if (typeof path !== "string") return "#";
  const trimmed = path.trim();
  // Strictly enforce safe relative path to prevent javascript: or data: XSS payloads
  if (
    !trimmed.startsWith("/") ||
    /[:\\]/.test(trimmed) ||
    !/^\/[a-zA-Z0-9/_.~%-]+$/.test(trimmed)
  ) {
    return "#";
  }
  return escapeAttr(trimmed);
}

function sanitizeSafeSlug(slug: string): string {
  if (typeof slug !== "string") return "";
  const trimmed = slug.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return "";
  return escapeAttr(trimmed);
}

function formatMinutes(minutes?: number): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Builds clean, escaped HTML markup for a selected route destination popup card on the shared map.
 */
export function buildInteractiveRouteMapPopupHtml(
  dest: SharedMapDestination,
  originIata?: string,
): string {
  const cityName = escapeHtml(dest.city);
  const iataSafe = escapeHtml(dest.iata);
  const airportLabel =
    originIata && dest.airportName
      ? escapeHtml(`${dest.iata} · ${dest.airportName.split(" ")[0]}`)
      : escapeHtml(`${dest.city} (${dest.iata})`);
  const durationText = escapeHtml(
    dest.typicalDuration || formatMinutes(dest.minDuration) || "Direct",
  );
  const frequencyText =
    typeof dest.frequency === "number" && dest.frequency > 0
      ? escapeHtml(`${dest.frequency} / week`)
      : "Varies";
  const airlinesText = escapeHtml((dest.airlines ?? []).join(", "));
  const durationRange = escapeHtml(
    dest.durationRange || formatMinutes(dest.minDuration) || durationText,
  );
  const fareCurrency = escapeHtml(dest.fareCurrency ?? "£");
  const fareText =
    typeof dest.fareMin === "number" && typeof dest.fareMax === "number"
      ? `${fareCurrency}${dest.fareMin} - ${fareCurrency}${dest.fareMax}`
      : "";
  const citySlug = sanitizeSafeSlug(dest.citySlug);
  const routePath = sanitizeSafePath(dest.routePath);
  const exploreLabel = escapeHtml(`EXPLORE ${dest.city.toUpperCase()}`);
  const ctaCompareLabel = originIata
    ? escapeHtml(`Explore ${originIata} to ${iataSafe}`)
    : "COMPARE NONSTOP FLIGHTS";

  return `
    <div class="interactive-map-popup-card">
      <div class="interactive-map-popup-header">
        <div>
          <h3 class="interactive-map-popup-title">${cityName}</h3>
          <p class="interactive-map-popup-subtitle">${airportLabel}</p>
        </div>
        <span class="interactive-map-popup-badge">${dest.isTopRoute ? "Top Route" : durationText}</span>
      </div>
      <div class="interactive-map-popup-details">
        <div class="interactive-map-popup-row">
          <span class="interactive-map-popup-label">⏱ Duration</span>
          <strong class="interactive-map-popup-val">${durationText}</strong>
        </div>
        <div class="interactive-map-popup-row">
          <span class="interactive-map-popup-label">🔄 Frequency</span>
          <strong class="interactive-map-popup-val">${frequencyText}</strong>
        </div>
        <div class="interactive-map-popup-row">
          <span class="interactive-map-popup-label">✈ Airlines</span>
          <strong class="interactive-map-popup-val">${airlinesText}</strong>
        </div>
        ${
          fareText
            ? `<div class="interactive-map-popup-row">
          <span class="interactive-map-popup-label">💵 Estimated one-way fare</span>
          <strong class="interactive-map-popup-val">${fareText}</strong>
        </div>`
            : `<div class="interactive-map-popup-row">
          <span class="interactive-map-popup-label">TYPICAL FLIGHT TIME</span>
          <strong class="interactive-map-popup-val">${durationRange}</strong>
        </div>`
        }
      </div>
      <div class="interactive-map-popup-actions">
        <a href="${citySlug ? `/flights-from/${citySlug}` : "#"}" class="interactive-map-popup-btn">${exploreLabel}</a>
        <a href="${routePath}" class="interactive-map-popup-btn interactive-map-popup-btn--primary">${ctaCompareLabel}</a>
      </div>
    </div>
  `;
}
