"use client";

import { useId, useState } from "react";
import type { Facet } from "../../domain/route-search-model";

type FacetChoicesRowProps = Readonly<{
  legend: string;
  name: string;
  facets: Facet[];
  selected?: readonly string[];
  formatter?: (val: string) => string;
  hideZeroCount?: boolean;
}>;

export function FacetChoicesRow({
  legend,
  name,
  facets,
  selected = [],
  formatter,
  hideZeroCount = false,
}: FacetChoicesRowProps) {
  const [search, setSearch] = useState("");
  const searchId = useId();

  const filteredFacets = facets.filter((facet) => {
    if (!search.trim()) return true;
    const label = formatter ? formatter(facet.value) : facet.value;
    return (
      label.toLowerCase().includes(search.toLowerCase()) ||
      facet.value.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <fieldset className="master-filter__fieldset">
      <div className="master-filter__fieldset-header">
        <legend className="master-filter__legend">{legend}</legend>
        {selected.length > 0 && (
          <span className="master-filter__facet-selected-badge">
            {selected.length} selected
          </span>
        )}
      </div>

      {facets.length > 4 ? (
        <div className="master-filter__facet-search">
          <svg
            className="master-filter__facet-search-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id={searchId}
            type="search"
            placeholder={`Search ${legend.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={`Search ${legend}`}
          />
          {search ? (
            <button
              type="button"
              className="master-filter__facet-search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="master-filter__choices">
        {filteredFacets.length === 0 ? (
          <p className="master-filter__no-facet">
            No options match &quot;{search}&quot;
          </p>
        ) : (
          filteredFacets.map((facet) => {
            const labelText = formatter ? formatter(facet.value) : facet.value;
            const isChecked = selected.includes(facet.value);
            return (
              <label key={facet.value} className="master-filter__choice-label">
                <input
                  type="checkbox"
                  name={name}
                  value={facet.value}
                  defaultChecked={isChecked}
                  className="master-filter__choice-input"
                />
                <span className="master-filter__custom-checkbox" aria-hidden="true">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="master-filter__choice-text">{labelText}</span>
                {!hideZeroCount && (
                  <span className="master-filter__choice-count">{facet.count}</span>
                )}
              </label>
            );
          })
        )}
      </div>
    </fieldset>
  );
}
