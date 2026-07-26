import type {
  RouteMapDestination,
  RouteMapReadModel,
} from "./route-map-model";

type Position = [longitude: number, latitude: number];

type PointFeature = {
  type: "Feature";
  id: string;
  properties:
    | {
        role: "origin";
        name: string;
        slug: string;
      }
    | ({
        role: "destination";
      } & RouteMapDestination);
  geometry: { type: "Point"; coordinates: Position };
};

type RouteFeature = {
  type: "Feature";
  id: string;
  properties: {
    from: string;
    to: string;
    citySlug: string;
    routePath: string;
  };
  geometry: { type: "LineString"; coordinates: Position[] };
};

export type RouteMapGeoJson = {
  points: { type: "FeatureCollection"; features: PointFeature[] };
  routes: { type: "FeatureCollection"; features: RouteFeature[] };
  bounds: [southwest: Position, northeast: Position];
};

/** Converts a route-map read model into interactive point and arc collections. */
export function buildRouteGeoJson(readModel: RouteMapReadModel): RouteMapGeoJson {
  const { origin, destinations } = readModel;
  const routeFeatures = destinations.map((destination): RouteFeature => ({
    type: "Feature",
    id: `route:${destination.citySlug}`,
    properties: {
      from: origin.slug,
      to: destination.citySlug,
      citySlug: destination.citySlug,
      routePath: destination.routePath,
    },
    geometry: {
      type: "LineString",
      coordinates: interpolateGreatCircle(origin, destination),
    },
  }));
  const mapCoordinates: Position[] = [
    [origin.longitude, origin.latitude],
    ...destinations.map(
      (destination): Position => [destination.longitude, destination.latitude],
    ),
    ...routeFeatures.flatMap((feature) => feature.geometry.coordinates),
  ];
  const longitudes = mapCoordinates.map(([longitude]) => longitude);
  const latitudes = mapCoordinates.map(([, latitude]) => latitude);

  return {
    points: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: `origin:${origin.slug}`,
          properties: {
            role: "origin",
            name: origin.name,
            slug: origin.slug,
          },
          geometry: {
            type: "Point",
            coordinates: [origin.longitude, origin.latitude],
          },
        },
        ...destinations.map((destination): PointFeature => ({
          type: "Feature",
          id: `destination:${destination.citySlug}`,
          properties: {
            role: "destination",
            ...destination,
          },
          geometry: {
            type: "Point",
            coordinates: [destination.longitude, destination.latitude],
          },
        })),
      ],
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

function interpolateGreatCircle(
  origin: Readonly<{ latitude: number; longitude: number }>,
  destination: Readonly<{ latitude: number; longitude: number }>,
): Position[] {
  const startLatitude = toRadians(origin.latitude);
  const startLongitude = toRadians(origin.longitude);
  const endLatitude = toRadians(destination.latitude);
  const endLongitude = toRadians(destination.longitude);
  const angularDistance = 2 * Math.asin(Math.sqrt(
    Math.sin((endLatitude - startLatitude) / 2) ** 2 +
      Math.cos(startLatitude) *
        Math.cos(endLatitude) *
        Math.sin((endLongitude - startLongitude) / 2) ** 2,
  ));

  if (angularDistance === 0) {
    return [[origin.longitude, origin.latitude]];
  }

  return Array.from({ length: 65 }, (_, index) => {
    const fraction = index / 64;
    const startWeight = Math.sin((1 - fraction) * angularDistance) /
      Math.sin(angularDistance);
    const endWeight = Math.sin(fraction * angularDistance) /
      Math.sin(angularDistance);
    const x = startWeight * Math.cos(startLatitude) * Math.cos(startLongitude) +
      endWeight * Math.cos(endLatitude) * Math.cos(endLongitude);
    const y = startWeight * Math.cos(startLatitude) * Math.sin(startLongitude) +
      endWeight * Math.cos(endLatitude) * Math.sin(endLongitude);
    const z = startWeight * Math.sin(startLatitude) +
      endWeight * Math.sin(endLatitude);

    return [
      toDegrees(Math.atan2(y, x)),
      toDegrees(Math.atan2(z, Math.hypot(x, y))),
    ];
  });
}

function toRadians(value: number): number {
  return value * Math.PI / 180;
}

function toDegrees(value: number): number {
  return value * 180 / Math.PI;
}
