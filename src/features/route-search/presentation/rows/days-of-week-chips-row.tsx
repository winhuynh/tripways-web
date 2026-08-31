"use client";

import { useState } from "react";

const DAYS_OF_WEEK = [
  { value: "1", label: "Mon", title: "Monday" },
  { value: "2", label: "Tue", title: "Tuesday" },
  { value: "3", label: "Wed", title: "Wednesday" },
  { value: "4", label: "Thu", title: "Thursday" },
  { value: "5", label: "Fri", title: "Friday" },
  { value: "6", label: "Sat", title: "Saturday" },
  { value: "7", label: "Sun", title: "Sunday" },
] as const;

type DaysOfWeekChipsRowProps = Readonly<{
  name?: string;
  label?: string;
  selected?: readonly string[];
}>;

export function DaysOfWeekChipsRow({
  name = "days_of_week",
  label = "Operating schedule",
  selected = [],
}: DaysOfWeekChipsRowProps) {
  const [activeDays, setActiveDays] = useState<string[]>([...selected]);

  function toggleDay(val: string) {
    setActiveDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val],
    );
  }

  function selectWeekend() {
    setActiveDays(["5", "6", "7"]);
  }

  function selectAllDays() {
    setActiveDays(["1", "2", "3", "4", "5", "6", "7"]);
  }

  function clearDays() {
    setActiveDays([]);
  }

  return (
    <fieldset className="master-filter__fieldset">
      <div className="master-filter__fieldset-header">
        <legend className="master-filter__legend">{label}</legend>
        {activeDays.length > 0 && (
          <span className="master-filter__facet-selected-badge">
            {activeDays.length}/7 days
          </span>
        )}
      </div>

      <div className="master-filter__days-grid" role="group" aria-label={label}>
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = activeDays.includes(day.value);
          return (
            <label
              key={day.value}
              title={day.title}
              className={`master-filter__day-chip ${
                isSelected ? "master-filter__day-chip--selected" : ""
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={day.value}
                checked={isSelected}
                onChange={() => toggleDay(day.value)}
                className="master-filter__sr-only"
              />
              <span>{day.label}</span>
            </label>
          );
        })}
      </div>

      <div className="master-filter__days-presets">
        <button
          type="button"
          className="master-filter__preset-btn"
          onClick={selectWeekend}
        >
          ⭐ Weekend only
        </button>
        {activeDays.length > 0 ? (
          <button
            type="button"
            className="master-filter__preset-btn master-filter__preset-btn--clear"
            onClick={clearDays}
          >
            Reset
          </button>
        ) : (
          <button
            type="button"
            className="master-filter__preset-btn"
            onClick={selectAllDays}
          >
            All days
          </button>
        )}
      </div>
    </fieldset>
  );
}
