import {
  findHub,
  getHubRouteNetwork,
} from "@/features/homepage/domain/homepage-routes-data";

export type RouteNavigation = Readonly<{
  kind: "city" | "route";
  href: string;
}>;

/**
 * Resolves the header's fixture-backed route selection to an existing canonical page.
 */
export function resolveRouteNavigation(
  originQuery: string,
  destinationQuery: string,
): RouteNavigation | null {
  const origin = findHub(originQuery);
  if (!origin) return null;

  const destination = findHub(destinationQuery);
  if (!destination) {
    return { kind: "city", href: `/flights-from/${origin.citySlug}` };
  }

  const route = getHubRouteNetwork(origin).destinations.find(
    (item) => item.citySlug === destination.citySlug,
  );
  if (route) return { kind: "route", href: route.routePath };

  return { kind: "city", href: `/flights-from/${origin.citySlug}` };
}
