"use client";

import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { interpolateGreatCircle } from "@/shared/domain/interpolate-great-circle";
import { FLAT_ROUTE_MAP_STYLE } from "@/features/route-map/infrastructure/map/flat-route-map-style";
import {
  buildInteractiveRouteMapPopupHtml,
  type SharedMapDestination,
} from "./interactive-route-map-popup";
import "./interactive-route-map.css";

export type RouteMapOrigin = Readonly<{
  name: string;
  iata: string;
  latitude: number;
  longitude: number;
  citySlug?: string;
}>;

export type InteractiveRouteMapProps = Readonly<{
  origin: RouteMapOrigin;
  destinations: readonly SharedMapDestination[];
  showOriginBadge?: boolean;
  autoOpenFirstPopup?: boolean;
  height?: string;
  className?: string;
  ariaLabel?: string;
  bottomOverlay?: React.ReactNode;
}>;

export function InteractiveRouteMap({
  origin,
  destinations,
  showOriginBadge = false,
  autoOpenFirstPopup = true,
  height,
  className = "",
  ariaLabel,
  bottomOverlay,
}: InteractiveRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!containerRef.current) return;

    let map: MapLibreMap;
    let activePopup: maplibregl.Popup | null = null;
    const markers: maplibregl.Marker[] = [];

    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: FLAT_ROUTE_MAP_STYLE,
        center: [origin.longitude, origin.latitude],
        zoom: 2.3,
        renderWorldCopies: false,
      });
    } catch {
      queueMicrotask(() => setMapStatus("error"));
      return;
    }

    mapRef.current = map;
    map.scrollZoom.disable();
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    map.once("error", () => setMapStatus("error"));

    map.on("load", () => {
      // Build route line features and destination point features
      const routeFeatures = destinations.map((dest) => ({
        type: "Feature" as const,
        id: `route-${dest.iata}`,
        properties: {
          iata: dest.iata,
          city: dest.city,
          citySlug: dest.citySlug,
        },
        geometry: {
          type: "LineString" as const,
          coordinates: interpolateGreatCircle(origin, dest),
        },
      }));

      const pointFeatures = destinations.map((dest) => ({
        type: "Feature" as const,
        id: `point-${dest.iata}`,
        properties: {
          role: "destination",
          ...dest,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [dest.longitude, dest.latitude],
        },
      }));

      // Add Routes Line Layer
      map.addSource("shared-routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: routeFeatures,
        },
      });

      map.addLayer({
        id: "shared-routes-lines",
        type: "line",
        source: "shared-routes",
        paint: {
          "line-color": "#147df5",
          "line-width": 2,
          "line-opacity": 0.85,
        },
      });

      // Add Destinations Point Layer
      map.addSource("shared-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: pointFeatures,
        },
      });

      map.addLayer({
        id: "shared-dest-points",
        type: "circle",
        source: "shared-points",
        paint: {
          "circle-radius": 5,
          "circle-color": "#147df5",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      // Origin Pin Marker
      const originEl = document.createElement("div");
      originEl.className = "shared-map-origin-pin";
      const originMarker = new maplibregl.Marker({
        element: originEl,
        anchor: "center",
      })
        .setLngLat([origin.longitude, origin.latitude])
        .addTo(map);
      markers.push(originMarker);

      // Auto open first destination popup if requested
      if (autoOpenFirstPopup && destinations.length > 0) {
        const firstDest = destinations[0]!;
        activePopup = new maplibregl.Popup({
          offset: 14,
          closeButton: false,
          closeOnClick: false,
          className: "shared-map-custom-popup",
        })
          .setLngLat([firstDest.longitude, firstDest.latitude])
          .setHTML(buildInteractiveRouteMapPopupHtml(firstDest, origin.iata))
          .addTo(map);
      }

      setMapStatus("ready");
    });

    // Destination click interactions
    const handlePointClick = (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature || feature.geometry.type !== "Point") return;
      const props = feature.properties as unknown as SharedMapDestination;
      if (!props || !props.city) return;

      activePopup?.remove();
      activePopup = new maplibregl.Popup({
        offset: 14,
        closeButton: true,
        className: "shared-map-custom-popup",
      })
        .setLngLat(feature.geometry.coordinates as [number, number])
        .setHTML(buildInteractiveRouteMapPopupHtml(props, origin.iata))
        .addTo(map);
    };

    map.on("click", "shared-dest-points", handlePointClick);
    map.on("mouseenter", "shared-dest-points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "shared-dest-points", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      activePopup?.remove();
      markers.forEach((m) => m.remove());
      mapRef.current = null;
      map.remove();
    };
  }, [origin, destinations, autoOpenFirstPopup]);

  return (
    <div
      className={`shared-map-frame ${className}`}
      style={height ? { height } : undefined}
      aria-label={ariaLabel ?? `Interactive flight route map from ${origin.name}`}
    >
      {showOriginBadge && (
        <div className="shared-map-origin-badge">
          <span className="shared-map-origin-badge__label">
            SHOWING FLIGHTS FROM
          </span>
          <strong className="shared-map-origin-badge__name">
            {origin.name} {origin.iata}
          </strong>
        </div>
      )}

      {mapStatus === "loading" && (
        <div className="shared-map-loading-overlay">
          <div className="shared-map-spinner" />
          <span>Loading interactive routes...</span>
        </div>
      )}

      {bottomOverlay ? (
        <div className="shared-map-bottom-overlay">{bottomOverlay}</div>
      ) : null}

      <div className="shared-map-canvas" ref={containerRef} />
    </div>
  );
}
