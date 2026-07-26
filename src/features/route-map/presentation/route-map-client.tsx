"use client";

import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import { buildRouteGeoJson } from "../domain/build-route-geojson";
import type { RouteMapReadModel } from "../domain/route-map-model";
import {
  calculateGlobalRouteMapZoom,
  FLAT_ROUTE_MAP_STYLE,
} from "../infrastructure/map/flat-route-map-style";
import {
  focusRouteFeatures,
  resetRouteFeatures,
  ROUTE_LINE_PAINT,
  ROUTE_POINT_PAINT,
} from "./route-map-interaction";
import { buildRouteMapPopupHtml } from "./route-map-popup";
import { RouteMapFallback } from "./route-map-fallback";

/**
 * Owns MapLibre setup, route hover/click interaction, and teardown for a
 * reusable city or airport route-map read model.
 */
export function RouteMapClient({
  readModel,
}: Readonly<{ readModel: RouteMapReadModel }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!containerRef.current || readModel.destinations.length === 0) return;

    const geoJson = buildRouteGeoJson(readModel);
    const destinationSlugs = readModel.destinations.map(
      (destination) => destination.citySlug,
    );
    const destinationsBySlug = new Map(
      readModel.destinations.map((destination) => [
        destination.citySlug,
        destination,
      ]),
    );
    let destinationLabel: maplibregl.Marker | null = null;
    let activePopup: maplibregl.Popup | null = null;
    let pinnedDestinationSlug: string | null = null;
    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: FLAT_ROUTE_MAP_STYLE,
        center: [0, 10],
        zoom: calculateGlobalRouteMapZoom(containerRef.current.clientWidth),
        renderWorldCopies: false,
      });
    } catch {
      queueMicrotask(() => setState("error"));
      return;
    }

    mapRef.current = map;
    map.scrollZoom.disable();
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    map.once("error", () => setState("error"));
    map.on("load", () => {
      map.addSource("route-map-lines", {
        type: "geojson",
        data: geoJson.routes,
      });
      map.addSource("route-map-points", {
        type: "geojson",
        data: geoJson.points,
      });
      map.addLayer({
        id: "route-map-lines",
        type: "line",
        source: "route-map-lines",
        paint: ROUTE_LINE_PAINT,
      });
      map.addLayer({
        id: "route-map-points",
        type: "circle",
        source: "route-map-points",
        paint: ROUTE_POINT_PAINT,
      });

      const originLabel = document.createElement("span");
      originLabel.className =
        "route-map-location-label route-map-location-label--origin";
      originLabel.textContent = readModel.origin.name;
      new maplibregl.Marker({
        element: originLabel,
        anchor: "bottom",
        offset: [0, -12],
      })
        .setLngLat([readModel.origin.longitude, readModel.origin.latitude])
        .addTo(map);

      setState("ready");
    });

    const readDestinationSlug = (
      event: maplibregl.MapLayerMouseEvent,
    ): string | null => {
      const properties = event.features?.[0]?.properties as
        | { citySlug?: string }
        | undefined;
      return properties?.citySlug ?? null;
    };

    const showDestinationLabel = (destinationSlug: string): void => {
      const destination = destinationsBySlug.get(destinationSlug);
      if (!destination) return;

      destinationLabel?.remove();
      const label = document.createElement("span");
      label.className =
        "route-map-location-label route-map-location-label--destination";
      label.textContent = destination.cityName;
      destinationLabel = new maplibregl.Marker({
        element: label,
        anchor: "bottom",
        offset: [0, -8],
      })
        .setLngLat([destination.longitude, destination.latitude])
        .addTo(map);
    };

    const focusDestination = (destinationSlug: string): void => {
      if (!destinationsBySlug.has(destinationSlug)) return;
      focusRouteFeatures(map, destinationSlugs, destinationSlug);
      showDestinationLabel(destinationSlug);
    };

    const resetFocus = (): void => {
      resetRouteFeatures(map, destinationSlugs);
      destinationLabel?.remove();
      destinationLabel = null;
    };

    const handlePointerEnter = (
      event: maplibregl.MapLayerMouseEvent,
    ): void => {
      map.getCanvas().style.cursor = "pointer";
      if (pinnedDestinationSlug) return;
      const destinationSlug = readDestinationSlug(event);
      if (destinationSlug) focusDestination(destinationSlug);
    };

    const handlePointerLeave = (): void => {
      map.getCanvas().style.cursor = "";
      if (!pinnedDestinationSlug) resetFocus();
    };

    const handleDestinationClick = (
      event: maplibregl.MapLayerMouseEvent,
    ): void => {
      const destinationSlug = readDestinationSlug(event);
      if (!destinationSlug) return;
      const destination = destinationsBySlug.get(destinationSlug);
      if (!destination) return;

      pinnedDestinationSlug = destinationSlug;
      focusDestination(destinationSlug);
      activePopup?.remove();
      activePopup = new maplibregl.Popup({ offset: 12 })
        .setLngLat([destination.longitude, destination.latitude])
        .setHTML(buildRouteMapPopupHtml(destination))
        .addTo(map);
    };

    map.on("mouseenter", "route-map-lines", handlePointerEnter);
    map.on("mousemove", "route-map-lines", handlePointerEnter);
    map.on("mouseleave", "route-map-lines", handlePointerLeave);
    map.on("click", "route-map-lines", handleDestinationClick);
    map.on("mouseenter", "route-map-points", handlePointerEnter);
    map.on("mousemove", "route-map-points", handlePointerEnter);
    map.on("mouseleave", "route-map-points", handlePointerLeave);
    map.on("click", "route-map-points", handleDestinationClick);
    map.on("click", (event) => {
      const interactiveFeatures = map.queryRenderedFeatures(event.point, {
        layers: ["route-map-lines", "route-map-points"],
      });
      if (interactiveFeatures.length > 0) return;

      pinnedDestinationSlug = null;
      resetFocus();
    });

    return () => {
      activePopup?.remove();
      destinationLabel?.remove();
      mapRef.current = null;
      map.remove();
    };
  }, [readModel]);

  return (
    <div
      aria-label={`Interactive direct-route map from ${readModel.origin.name}`}
      className="route-map-shell"
      role="region"
    >
      {state !== "ready" && (
        <div className="route-map-overlay">
          <RouteMapFallback
            origin={readModel.origin}
            state={state === "error" ? "error" : "loading"}
          />
        </div>
      )}
      <div className="route-map-canvas" ref={containerRef} />
      <div className="route-map-disclaimer">
        Published direct-route graph · not live tracking
      </div>
    </div>
  );
}
