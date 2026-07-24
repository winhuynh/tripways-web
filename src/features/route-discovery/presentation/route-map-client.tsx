"use client";

import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import { buildRouteMapData } from "../domain/route-map";
import type { Airport } from "../domain/airport";
import { ROUTE_MAP_STYLE_URL } from "../infrastructure/map/map-style";
import { RouteMapFallback } from "./route-map-fallback";

type RouteMapClientProps = {
  destinations: readonly Airport[];
  origin: Airport;
};

export function RouteMapClient({ destinations, origin }: RouteMapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    const data = buildRouteMapData(origin, destinations);
    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: ROUTE_MAP_STYLE_URL,
        center: [origin.longitude, origin.latitude],
        zoom: 2,
      });
    } catch {
      queueMicrotask(() => setState("error"));
      return;
    }
    mapRef.current = map;
    map.scrollZoom.disable();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.once("error", () => setState("error"));

    map.on("load", () => {
      map.addSource("route-lines", { type: "geojson", data: data.routes });
      map.addSource("route-airports", { type: "geojson", data: data.airports });
      map.addLayer({
        id: "route-lines",
        type: "line",
        source: "route-lines",
        paint: {
          "line-color": "#147df5",
          "line-width": 3,
          "line-opacity": 0.8,
          "line-dasharray": [2, 1.5],
        },
      });
      map.addLayer({
        id: "airport-points",
        type: "circle",
        source: "route-airports",
        paint: {
          "circle-radius": ["case", ["==", ["get", "role"], "origin"], 8, 6],
          "circle-color": ["case", ["==", ["get", "role"], "origin"], "#101828", "#147df5"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });
      [origin, ...destinations].forEach((airport) => {
        const label = document.createElement("span");
        label.className = "route-map-airport-label";
        label.textContent = airport.iata;
        new maplibregl.Marker({ element: label, anchor: "bottom", offset: [0, -10] })
          .setLngLat([airport.longitude, airport.latitude])
          .addTo(map);
      });
      map.fitBounds(data.bounds, {
        padding: { top: 70, right: 70, bottom: 70, left: 70 },
        maxZoom: 5,
        duration: 0,
      });
      setState("ready");
    });

    map.on("click", "airport-points", (event) => {
      const feature = event.features?.[0];
      if (!feature || feature.geometry.type !== "Point") return;
      const properties = feature.properties as {
        iata: string;
        name: string;
        city: string;
        country: string;
      };
      new maplibregl.Popup({ offset: 12 })
        .setLngLat(feature.geometry.coordinates as [number, number])
        .setHTML(
          `<strong>${escapeHtml(properties.iata)} · ${escapeHtml(properties.city)}</strong>` +
            `<br>${escapeHtml(properties.name)}` +
            `<br>${escapeHtml(properties.country)}`,
        )
        .addTo(map);
    });
    map.on("mouseenter", "airport-points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "airport-points", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, [destinations, origin]);

  if (state === "error") {
    return <RouteMapFallback destinations={destinations} origin={origin} state="error" />;
  }

  return (
    <div
      aria-label={`Interactive route map from ${origin.city}`}
      className="route-map-shell relative overflow-hidden"
      role="region"
    >
      {state === "loading" && (
        <div className="absolute inset-0 z-10">
          <RouteMapFallback destinations={destinations} origin={origin} state="loading" />
        </div>
      )}
      <div className="size-full" ref={containerRef} />
      <div className="pointer-events-none absolute bottom-8 left-3 z-10 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-[#075fc4] shadow-sm sm:left-4">
        Stored route graph · not live tracking
      </div>
    </div>
  );
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
