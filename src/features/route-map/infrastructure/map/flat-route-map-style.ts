import type { StyleSpecification } from "maplibre-gl";

const MAPLIBRE_WORLD_SIZE_AT_ZOOM_ZERO = 512;

/** Calculates the zoom that fits one whole world copy into the viewport width. */
export function calculateGlobalRouteMapZoom(viewportWidth: number): number {
  return Math.log2(viewportWidth / MAPLIBRE_WORLD_SIZE_AT_ZOOM_ZERO);
}

/** Flat, low-emphasis world style that keeps discovery routes visually dominant. */
export const FLAT_ROUTE_MAP_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
      attribution:
        "OpenFreeMap © OpenMapTiles Data from OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "flat-background",
      type: "background",
      paint: {
        "background-color": "#f4f7f7",
      },
    },
    {
      id: "flat-water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: [
        "match",
        ["geometry-type"],
        ["MultiPolygon", "Polygon"],
        true,
        false,
      ],
      paint: {
        "fill-color": "#8abcc8",
      },
    },
    {
      id: "flat-country-boundaries",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", ["get", "admin_level"], 2],
        ["!=", ["get", "maritime"], 1],
        ["!=", ["get", "disputed"], 1],
      ],
      paint: {
        "line-color": "#b9cdd1",
        "line-opacity": 0.62,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          1,
          0.35,
          5,
          0.65,
        ],
      },
    },
    {
      id: "flat-disputed-boundaries",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: [
        "all",
        ["!=", ["get", "maritime"], 1],
        ["==", ["get", "disputed"], 1],
      ],
      paint: {
        "line-color": "#b9cdd1",
        "line-dasharray": [2, 2],
        "line-opacity": 0.5,
        "line-width": 0.55,
      },
    },
    {
      id: "flat-country-labels",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 0,
      maxzoom: 6,
      filter: ["==", ["get", "class"], "country"],
      layout: {
        "text-field": [
          "coalesce",
          ["get", "name:en"],
          ["get", "name"],
        ],
        "text-font": ["Noto Sans Regular"],
        "text-letter-spacing": 0.08,
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          1,
          8,
          5,
          11,
        ],
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": "#54717a",
        "text-halo-color": "#f4f7f7",
        "text-halo-width": 1,
        "text-opacity": 0.48,
      },
    },
  ],
};
