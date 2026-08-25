"use client";

import { useState } from "react";

type SearchInputRowProps = Readonly<{
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
}>;

export function SearchInputRow({
  name,
  label,
  placeholder = "Search...",
  defaultValue = "",
  maxLength = 80,
}: SearchInputRowProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="master-filter__field">
      <label htmlFor={name} className="master-filter__label-title">
        {label}
      </label>
      <div className="master-filter__search-wrap">
        <svg
          className="master-filter__search-icon"
          width="16"
          height="16"
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
          id={name}
          name={name}
          type="text"
          className="master-filter__search-input"
          maxLength={maxLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
        {value ? (
          <button
            type="button"
            className="master-filter__search-clear"
            onClick={() => setValue("")}
            aria-label="Clear input"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
