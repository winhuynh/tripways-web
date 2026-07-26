import type { Airport } from "./airport";

type Position = [longitude: number, latitude: number];

type PointFeature = {
  type: "Feature";
  properties: Pick<Airport, "iata" | "name" | "city" | "country"> & {
    role: "origin" | "destination";
  };
  geometry: { type: "Point"; coordinates: Position };
};

type RouteFeature = {
  type: "Feature";
  properties: { from: string; to: string };
  geometry: { type: "LineString"; coordinates: Position[] };
};

export type RouteMapData = {
  airports: { type: "FeatureCollection"; features: PointFeature[] };
  routes: { type: "FeatureCollection"; features: RouteFeature[] };
  bounds: [southwest: Position, northeast: Position];
};

/** Builds map-ready airport points, great-circle lines, and viewport bounds. */
export function buildRouteMapData(
  origin: Airport,
  destinations: readonly Airport[],
): RouteMapData {
  const airports = [origin, ...destinations];
  const routeFeatures = destinations.map((destination) => ({
    type: "Feature" as const,
    properties: { from: origin.iata, to: destination.iata },
    geometry: {
      type: "LineString" as const,
      coordinates: interpolateGreatCircle(origin, destination),
    },
  }));
  const mapCoordinates = [
    ...airports.map((airport): Position => [airport.longitude, airport.latitude]),
    ...routeFeatures.flatMap((feature) => feature.geometry.coordinates),
  ];
  const longitudes = mapCoordinates.map(([longitude]) => longitude);
  const latitudes = mapCoordinates.map(([, latitude]) => latitude);

  return {
    airports: {
      type: "FeatureCollection",
      features: airports.map((airport, index) => ({
        type: "Feature",
        properties: {
          iata: airport.iata,
          name: airport.name,
          city: airport.city,
          country: airport.country,
          role: index === 0 ? "origin" : "destination",
        },
        geometry: {
          type: "Point",
          coordinates: [airport.longitude, airport.latitude],
        },
      })),
    },
    routes: {
      type: "FeatureCollection",
      features: routeFeatures,
    },
    bounds: [
      [Math.min(...longitudes), Math.min(...latitudes)],
      [Math.max(...longitudes), Math.max(...latitudes)],
    ],
  };
}

function interpolateGreatCircle(origin: Airport, destination: Airport): Position[] {
  const startLatitude = toRadians(origin.latitude);
  const startLongitude = toRadians(origin.longitude);
  const endLatitude = toRadians(destination.latitude);
  const endLongitude = toRadians(destination.longitude);
  const angularDistance = 2 * Math.asin(Math.sqrt(
    Math.sin((endLatitude - startLatitude) / 2) ** 2 +
      Math.cos(startLatitude) * Math.cos(endLatitude) *
        Math.sin((endLongitude - startLongitude) / 2) ** 2,
  ));

  if (angularDistance === 0) return [[origin.longitude, origin.latitude]];

  return Array.from({ length: 65 }, (_, index) => {
    const fraction = index / 64;
    const startWeight = Math.sin((1 - fraction) * angularDistance) /
      Math.sin(angularDistance);
    const endWeight = Math.sin(fraction * angularDistance) / Math.sin(angularDistance);
    const x = startWeight * Math.cos(startLatitude) * Math.cos(startLongitude) +
      endWeight * Math.cos(endLatitude) * Math.cos(endLongitude);
    const y = startWeight * Math.cos(startLatitude) * Math.sin(startLongitude) +
      endWeight * Math.cos(endLatitude) * Math.sin(endLongitude);
    const z = startWeight * Math.sin(startLatitude) + endWeight * Math.sin(endLatitude);
    return [toDegrees(Math.atan2(y, x)), toDegrees(Math.atan2(z, Math.hypot(x, y)))];
  });
}

function toRadians(value: number): number {
  return value * Math.PI / 180;
}

function toDegrees(value: number): number {
  return value * 180 / Math.PI;
}
