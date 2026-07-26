import type { RouteMapDestination } from "../domain/route-map-model";

/** Builds escaped popup markup for a selected destination route. */
export function buildRouteMapPopupHtml(
  destination: RouteMapDestination,
): string {
  return [
    '<article class="route-map-popup">',
    `<strong>${escapeHtml(destination.cityName)}, ${escapeHtml(destination.countryName)}</strong>`,
    `<span>From ${escapeHtml(destination.originAirports.join(", "))}</span>`,
    `<span>Arrives at ${escapeHtml(destination.destinationAirports.join(", "))}</span>`,
    `<span>Airlines: ${escapeHtml(destination.airlines.join(", "))}</span>`,
    `<span>Shortest flight: ${escapeHtml(formatDuration(destination.shortestDurationMinutes))}</span>`,
    `<a href="${escapeAttribute(destination.routePath)}">Explore direct flights</a>`,
    "</article>",
  ].join("");
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
