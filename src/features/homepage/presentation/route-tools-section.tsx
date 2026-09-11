"use client";

import { useState } from "react";
import Link from "next/link";

type RouteTool = {
  id: string;
  icon: (isActive: boolean) => React.ReactNode;
  title: string;
  summary: string;
  badge: string;
  spotlightHeading: string;
  spotlightBody: string;
  ctaText: string;
  ctaHref: string;
  previewType: "connections" | "map" | "airlines" | "directory";
};

const TOOLS: readonly RouteTool[] = [
  {
    id: "connections",
    icon: (isActive) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isActive ? "#0066ff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M6 9v3a4 4 0 0 0 4 4h4" />
        <polyline points="14 12 18 16 14 20" />
      </svg>
    ),
    title: "Compare direct and 1-stop connections",
    summary:
      "The Route Explorer shows whether a route has nonstop flights or reveals the smartest 1-stop transfer hubs to minimize total travel time.",
    badge: "Connection Graph",
    spotlightHeading: "Find the shortest route paths and transfer hubs",
    spotlightBody:
      "Skip exhausting 20-hour layovers. See verified direct flight paths or discover the most logical connecting airports between any two cities with exact distance and typical flight durations.",
    ctaText: "Search route connections",
    ctaHref: "/flights/london-to-singapore",
    previewType: "connections",
  },
  {
    id: "map",
    icon: (isActive) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isActive ? "#0066ff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Map your flight corridors visually",
    summary:
      "The interactive flight map visualizes great-circle flight paths and connecting corridors radiating from any hub worldwide.",
    badge: "Interactive Flight Map",
    spotlightHeading: "Explore global air corridors before you book",
    spotlightBody:
      "Understand the geography of your journey before locking in dates. Explore airport nodes, great-circle trajectories, and regional connections on a high-performance interactive map.",
    ctaText: "Explore the global map",
    ctaHref: "#home-map",
    previewType: "map",
  },
  {
    id: "airlines",
    icon: (isActive) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isActive ? "#0066ff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
      </svg>
    ),
    title: "See every airline flying your route",
    summary:
      "Airline and alliance breakdowns let you compare all operating carriers on each leg with zero commission bias.",
    badge: "Carrier Landscape",
    spotlightHeading: "Full carrier transparency with zero ranking bias",
    spotlightBody:
      "Traditional booking engines promote airlines that pay higher commissions. Tripways displays every carrier operating each flight segment—from global alliances to low-cost airlines—with verified schedules.",
    ctaText: "Explore trending airlines",
    ctaHref: "/flights/new-york-to-paris",
    previewType: "airlines",
  },
  {
    id: "directory",
    icon: (isActive) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isActive ? "#0066ff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 19 21 12 17 5 21 12 2" />
      </svg>
    ),
    title: "Discover everywhere you can fly from your city",
    summary:
      "The City Hub Directory lists all reachable destinations from your local airport without having to guess specific dates.",
    badge: "City Hub Directory",
    spotlightHeading: "Browse all departures from your nearest airport",
    spotlightBody:
      "Not sure where to travel yet? Browse a complete directory of nonstop and regional destinations departing from your home airport, complete with typical flight durations and distances.",
    ctaText: "Browse worldwide hubs",
    ctaHref: "#global-directory",
    previewType: "directory",
  },
] as const;

export function RouteToolsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeTool = TOOLS[activeIdx];

  return (
    <section
      className="home-tools-section"
      aria-label="Useful tools to help you plan smarter flight routes"
    >
      <div className="pseo-container">
        <div className="home-tools__header">
          <span className="home-section-eyebrow">Flight Intelligence</span>
          <h2 className="home-tools__title">
            Useful tools to help you plan smarter flight routes
          </h2>
          <p className="home-tools__intro">
            Explore connection graphs, interactive flight paths, and carrier networks designed for smarter pre-trip planning.
          </p>
        </div>

        <div className="home-tools-layout">
          {/* Left Column: Interactive Tools List */}
          <div
            className="home-tools-list"
            role="tablist"
            aria-label="Tripways route planning tools"
          >
            {TOOLS.map((tool, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  id={`tool-tab-${tool.id}`}
                  aria-selected={isActive}
                  aria-controls={`tool-panel-${tool.id}`}
                  className={`home-tool-item ${isActive ? "home-tool-item--active" : ""}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <div className="home-tool-item__icon-wrap">
                    {tool.icon(isActive)}
                  </div>
                  <div className="home-tool-item__content">
                    <h3 className="home-tool-item__title">{tool.title}</h3>
                    <p className="home-tool-item__summary">{tool.summary}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Spotlight Showcase Panel */}
          <div
            className="home-tool-spotlight"
            id={`tool-panel-${activeTool.id}`}
            role="tabpanel"
            aria-labelledby={`tool-tab-${activeTool.id}`}
          >
            <div className="home-spotlight-top">
              <span className="home-spotlight-badge">{activeTool.badge}</span>
              <h3 className="home-spotlight-heading">
                {activeTool.spotlightHeading}
              </h3>
              <p className="home-spotlight-body">
                {activeTool.spotlightBody}
              </p>
            </div>

            {/* Dynamic UI Graphic Widget based on active tool */}
            <div className="home-spotlight-graphic" aria-hidden="true">
              {activeTool.previewType === "connections" && (
                <div className="spotlight-widget spotlight-widget--connections">
                  <div className="widget-row widget-row--direct">
                    <div className="widget-route-badge widget-route-badge--direct">Nonstop Option</div>
                    <div className="widget-route-nodes">
                      <span className="widget-iata">LHR</span>
                      <span className="widget-flight-arrow">&rarr;</span>
                      <span className="widget-iata">SIN</span>
                    </div>
                    <span className="widget-meta">13h 05m &bull; Direct</span>
                  </div>
                  <div className="widget-row widget-row--transfer">
                    <div className="widget-route-badge widget-route-badge--transfer">Optimal 1-Stop</div>
                    <div className="widget-route-nodes">
                      <span className="widget-iata">LHR</span>
                      <span className="widget-flight-arrow">&rarr;</span>
                      <span className="widget-hub-pill">DOH</span>
                      <span className="widget-flight-arrow">&rarr;</span>
                      <span className="widget-iata">SIN</span>
                    </div>
                    <span className="widget-meta">15h 20m &bull; Shortest connection</span>
                  </div>
                </div>
              )}

              {activeTool.previewType === "map" && (
                <div className="spotlight-widget spotlight-widget--map">
                  <div className="widget-map-graphic">
                    <div className="widget-map-radar-ring" />
                    <div className="widget-map-node widget-map-node--center">
                      <span>LHR</span>
                    </div>
                    <div className="widget-map-node widget-map-node--target-1">
                      <span>JFK</span>
                    </div>
                    <div className="widget-map-node widget-map-node--target-2">
                      <span>SIN</span>
                    </div>
                    <div className="widget-map-node widget-map-node--target-3">
                      <span>HND</span>
                    </div>
                    <div className="widget-map-arc" />
                  </div>
                  <span className="widget-map-label">Great-Circle Corridor Visualizer</span>
                </div>
              )}

              {activeTool.previewType === "airlines" && (
                <div className="spotlight-widget spotlight-widget--airlines">
                  <div className="widget-carrier-header">
                    <span>Operating Carriers on Route</span>
                    <span className="widget-verified-tag">100% Unbiased</span>
                  </div>
                  <div className="widget-carrier-list">
                    <div className="widget-carrier-item">
                      <span className="widget-carrier-code">SQ</span>
                      <span className="widget-carrier-name">Singapore Airlines</span>
                      <span className="widget-carrier-type">Star Alliance</span>
                    </div>
                    <div className="widget-carrier-item">
                      <span className="widget-carrier-code">BA</span>
                      <span className="widget-carrier-name">British Airways</span>
                      <span className="widget-carrier-type">Oneworld</span>
                    </div>
                    <div className="widget-carrier-item">
                      <span className="widget-carrier-code">QF</span>
                      <span className="widget-carrier-name">Qantas</span>
                      <span className="widget-carrier-type">Nonstop &bull; Daily</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTool.previewType === "directory" && (
                <div className="spotlight-widget spotlight-widget--directory">
                  <div className="widget-dir-header">
                    <span>Popular Departures &bull; London Heathrow (LHR)</span>
                  </div>
                  <div className="widget-dir-grid">
                    <div className="widget-dir-chip">
                      <strong>Paris CDG</strong>
                      <small>1h 20m &bull; 344 km</small>
                    </div>
                    <div className="widget-dir-chip">
                      <strong>New York JFK</strong>
                      <small>7h 55m &bull; 5,555 km</small>
                    </div>
                    <div className="widget-dir-chip">
                      <strong>Dubai DXB</strong>
                      <small>7h 05m &bull; 5,470 km</small>
                    </div>
                    <div className="widget-dir-chip">
                      <strong>Tokyo HND</strong>
                      <small>14h 20m &bull; 9,585 km</small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="home-spotlight-bottom">
              <Link href={activeTool.ctaHref} className="home-spotlight-cta">
                {activeTool.ctaText} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
