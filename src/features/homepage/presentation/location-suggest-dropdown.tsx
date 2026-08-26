"use client";

import type { ReactNode } from "react";
import type { LocationSuggestionItem } from "../domain/location-suggest";

type LocationSuggestDropdownProps = {
  items: readonly LocationSuggestionItem[];
  query: string;
  onSelect: (item: LocationSuggestionItem) => void;
  activeIndex?: number;
};

/**
 * Highlights characters in text that match the search query.
 */
function highlightMatch(text: string, query: string): ReactNode {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmedQuery.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return text;
  }

  const before = text.slice(0, matchIndex);
  const matched = text.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = text.slice(matchIndex + trimmedQuery.length);

  return (
    <>
      {before}
      <strong className="suggest-highlight">{matched}</strong>
      {after}
    </>
  );
}

export function LocationSuggestDropdown({
  items,
  query,
  onSelect,
  activeIndex = -1,
}: LocationSuggestDropdownProps) {
  if (!items || items.length === 0) return null;

  return (
    <ul
      className="location-suggest-dropdown"
      role="listbox"
      aria-label="Location suggestions"
    >
      {items.map((item, index) => {
        const isSelected = index === activeIndex;
        const isAction = item.type === "action";

        return (
          <li
            key={item.id}
            role="option"
            aria-selected={isSelected}
            className={`suggest-item ${isAction ? "suggest-item--action" : ""} ${
              isSelected ? "suggest-item--active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(item);
            }}
          >
            <div className="suggest-item__icon" aria-hidden="true">
              {item.type === "city" && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              )}

              {item.type === "airport" && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              )}

              {item.type === "action" && item.actionType === "everywhere" && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <path d="M11 8a3 3 0 0 0-3 3" />
                </svg>
              )}

              {item.type === "action" && item.actionType === "multicity" && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
                </svg>
              )}
            </div>

            <div className="suggest-item__content">
              <div className="suggest-item__title">
                {highlightMatch(item.title, query)}
              </div>
              {item.subtitle && (
                <div className="suggest-item__subtitle">{item.subtitle}</div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
