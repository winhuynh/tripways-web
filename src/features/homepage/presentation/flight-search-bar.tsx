"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  searchLocationSuggestions,
  getNearbyAirports,
  findAirportByIata,
  type LocationSuggestionItem,
} from "../domain/location-suggest";
import { type HubAirport } from "../domain/homepage-routes-data";
import { LocationSuggestDropdown } from "./location-suggest-dropdown";

type FlightSearchBarProps = {
  currentHub?: HubAirport;
  onSelectHub?: (hub: HubAirport) => void;
};

export function FlightSearchBar({ currentHub, onSelectHub }: FlightSearchBarProps) {
  const router = useRouter();

  // Inputs
  const [fromQuery, setFromQuery] = useState(
    currentHub ? `${currentHub.cityName} (${currentHub.iata})` : "London (LHR)",
  );
  const [fromIata, setFromIata] = useState(currentHub?.iata ?? "LHR");

  const [toQuery, setToQuery] = useState("");
  const [toIata, setToIata] = useState("");

  // Options: Direct flights only & Multi-city
  const [directOnly, setDirectOnly] = useState(false);
  const [isMultiCity, setIsMultiCity] = useState(false);

  // Dropdown state
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when currentHub changes from geolocation or external props
  const [prevHub, setPrevHub] = useState(currentHub);
  if (currentHub && currentHub !== prevHub) {
    setPrevHub(currentHub);
    setFromQuery(`${currentHub.cityName} (${currentHub.iata})`);
    setFromIata(currentHub.iata);
  }

  // Click outside to dismiss dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute suggestions based on active field and query
  const getSuggestions = (): LocationSuggestionItem[] => {
    if (activeField === "from") {
      const isCleanSelection = fromQuery.includes(`(${fromIata})`);
      if (!fromQuery.trim() || isCleanSelection) {
        // Show origin airport + nearby airports within 300km
        return getNearbyAirports({
          originIata: fromIata || "LHR",
          maxDistanceKm: 300,
          limit: 8,
        });
      }
      return searchLocationSuggestions(fromQuery, {
        originIata: fromIata,
        includeQuickActions: false,
        limit: 8,
      });
    }

    if (activeField === "to") {
      if (!toQuery.trim()) {
        // Show quick action items when empty
        return searchLocationSuggestions("", {
          includeQuickActions: true,
        });
      }
      return searchLocationSuggestions(toQuery, {
        includeQuickActions: true,
        limit: 8,
      });
    }

    return [];
  };

  const suggestions = getSuggestions();

  // Swap From and To
  const handleSwap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const tempQuery = fromQuery;
    const tempIata = fromIata;

    setFromQuery(toQuery || "London (LHR)");
    setFromIata(toIata || "LHR");

    setToQuery(tempQuery);
    setToIata(tempIata);
  };

  // Handle selecting an item
  const handleSelectSuggestion = (item: LocationSuggestionItem) => {
    if (item.type === "action") {
      if (item.actionType === "everywhere") {
        setToQuery("Explore everywhere");
        setToIata("EVERYWHERE");
      } else if (item.actionType === "multicity") {
        setIsMultiCity(true);
      }
      setActiveField(null);
      return;
    }

    if (activeField === "from") {
      setFromQuery(`${item.cityName} (${item.iata})`);
      setFromIata(item.iata ?? "");

      const matchedAirport = findAirportByIata(item.iata ?? "");
      if (matchedAirport && onSelectHub) {
        onSelectHub({
          iata: matchedAirport.iata,
          name: matchedAirport.name,
          cityName: matchedAirport.cityName,
          citySlug: matchedAirport.citySlug,
          countryName: matchedAirport.countryName,
          countryIso2: matchedAirport.countryIso2,
          latitude: matchedAirport.latitude,
          longitude: matchedAirport.longitude,
        });
      }

      // Auto advance to "To" field
      setActiveField("to");
      setTimeout(() => toInputRef.current?.focus(), 50);
    } else if (activeField === "to") {
      setToQuery(
        item.type === "city"
          ? `${item.cityName} (Any)`
          : `${item.cityName} (${item.iata})`,
      );
      setToIata(item.iata ?? "");
      setActiveField(null);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!activeField || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[activeIndex];
        if (selected) handleSelectSuggestion(selected);
      }
    } else if (e.key === "Escape") {
      setActiveField(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveField(null);

    const fromAirport = findAirportByIata(fromIata);
    const toAirport = findAirportByIata(toIata);

    if (toIata === "EVERYWHERE" || !toQuery) {
      if (fromAirport?.citySlug) {
        router.push(`/flights-from/${fromAirport.citySlug}`);
      }
      return;
    }

    if (fromAirport && toAirport) {
      router.push(`/flights/${fromAirport.citySlug}-to-${toAirport.citySlug}`);
    } else if (fromAirport?.citySlug) {
      router.push(`/flights-from/${fromAirport.citySlug}`);
    }
  };

  return (
    <div className="skyscanner-search-container" ref={containerRef}>
      {/* Top Options: Direct flights / Multi-city toggle */}
      <div className="search-top-controls">
        <button
          type="button"
          className={`search-pill-btn ${!isMultiCity ? "active" : ""}`}
          onClick={() => setIsMultiCity(false)}
        >
          Flight search
        </button>
        <button
          type="button"
          className={`search-pill-btn ${isMultiCity ? "active" : ""}`}
          onClick={() => setIsMultiCity(true)}
        >
          Multi-city search
        </button>
      </div>

      {/* Main Clean Search Bar (From, Swap, To, Search) */}
      <form
        className="flight-search-bar flight-search-bar--clean"
        onSubmit={handleSearchSubmit}
        onKeyDown={handleKeyDown}
        role="search"
      >
        {/* Cell 1: From */}
        <div
          className={`search-cell search-cell--from ${
            activeField === "from" ? "is-focused" : ""
          }`}
          onClick={() => {
            setActiveField("from");
            fromInputRef.current?.focus();
          }}
        >
          <label htmlFor="search-input-from" className="search-cell__label">
            From
          </label>
          <div className="search-cell__input-wrap">
            <input
              id="search-input-from"
              ref={fromInputRef}
              type="text"
              className="search-cell__input"
              value={fromQuery}
              placeholder="Country, city or airport..."
              onChange={(e) => {
                setFromQuery(e.target.value);
                setActiveField("from");
                setActiveIndex(-1);
              }}
              onFocus={() => {
                setActiveField("from");
                setActiveIndex(-1);
              }}
              autoComplete="off"
            />
            {fromQuery && activeField === "from" && (
              <button
                type="button"
                className="search-cell__clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setFromQuery("");
                  setFromIata("");
                  fromInputRef.current?.focus();
                }}
                aria-label="Clear departure location"
              >
                ✕
              </button>
            )}
          </div>

          {/* From Suggestions Dropdown */}
          {activeField === "from" && suggestions.length > 0 && (
            <div className="search-dropdown-wrapper">
              <LocationSuggestDropdown
                items={suggestions}
                query={fromQuery.includes(`(${fromIata})`) ? "" : fromQuery}
                onSelect={handleSelectSuggestion}
                activeIndex={activeIndex}
              />
            </div>
          )}
        </div>

        {/* Swap Button ⇄ */}
        <button
          type="button"
          className="search-swap-btn"
          onClick={handleSwap}
          title="Swap departure and destination"
          aria-label="Swap departure and destination"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* Cell 2: To */}
        <div
          className={`search-cell search-cell--to ${
            activeField === "to" ? "is-focused" : ""
          }`}
          onClick={() => {
            setActiveField("to");
            toInputRef.current?.focus();
          }}
        >
          <label htmlFor="search-input-to" className="search-cell__label">
            To
          </label>
          <div className="search-cell__input-wrap">
            <input
              id="search-input-to"
              ref={toInputRef}
              type="text"
              className="search-cell__input"
              value={toQuery}
              placeholder="Country, city or airport..."
              onChange={(e) => {
                setToQuery(e.target.value);
                setActiveField("to");
                setActiveIndex(-1);
              }}
              onFocus={() => {
                setActiveField("to");
                setActiveIndex(-1);
              }}
              autoComplete="off"
            />
            {toQuery && activeField === "to" && (
              <button
                type="button"
                className="search-cell__clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setToQuery("");
                  setToIata("");
                  toInputRef.current?.focus();
                }}
                aria-label="Clear destination"
              >
                ✕
              </button>
            )}
          </div>

          {/* To Suggestions Dropdown */}
          {activeField === "to" && suggestions.length > 0 && (
            <div className="search-dropdown-wrapper">
              <LocationSuggestDropdown
                items={suggestions}
                query={toQuery}
                onSelect={handleSelectSuggestion}
                activeIndex={activeIndex}
              />
            </div>
          )}
        </div>

        {/* Search CTA Button */}
        <button type="submit" className="search-submit-btn">
          Search flights
        </button>
      </form>

      {/* Bottom Options: Direct flights only */}
      <div className="search-bottom-options">
        <label className="search-checkbox-label">
          <input
            type="checkbox"
            className="search-checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
          />
          <span>Direct flights only</span>
        </label>
      </div>
    </div>
  );
}
