export type GeoCoordinate = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type LngLatPosition = [longitude: number, latitude: number];

/**
 * Computes great-circle intermediate points between origin and destination on a sphere.
 * Returns an array of [longitude, latitude] coordinates suitable for GeoJSON LineString.
 */
export function interpolateGreatCircle(
  origin: GeoCoordinate,
  destination: GeoCoordinate,
  segments = 48,
): LngLatPosition[] {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(origin.latitude);
  const lon1 = toRad(origin.longitude);
  const lat2 = toRad(destination.latitude);
  const lon2 = toRad(destination.longitude);

  const delta =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );

  if (delta === 0) return [[origin.longitude, origin.latitude]];

  const points: LngLatPosition[] = [];
  for (let i = 0; i <= segments; i++) {
    const fraction = i / segments;
    const A = Math.sin((1 - fraction) * delta) / Math.sin(delta);
    const B = Math.sin(fraction * delta) / Math.sin(delta);
    const x =
      A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y =
      A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    points.push([toDeg(lon), toDeg(lat)]);
  }

  return points;
}
