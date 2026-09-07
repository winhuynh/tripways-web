"use client";

import { useState } from "react";
import { formatDurationMinutes } from "../../domain/route-filter-labels";

type DurationSliderRowProps = Readonly<{
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initialValue?: number;
}>;

// Pre-computed normalized height curve for visual flight distribution
const DISTRIBUTION_CURVE = [
  0.25, 0.45, 0.75, 1.0, 0.9, 0.7, 0.55, 0.4, 0.35, 0.3, 0.25, 0.2, 0.18, 0.15,
  0.12, 0.1,
];

export function DurationSliderRow({
  name,
  label,
  min,
  max,
  step,
  initialValue,
}: DurationSliderRowProps) {
  const [val, setVal] = useState<number | undefined>(initialValue);

  const totalBars = DISTRIBUTION_CURVE.length;
  const currentThreshold = val ?? max;

  return (
    <div className="master-filter__slider-field">
      <div className="master-filter__slider-header">
        <label htmlFor={name} className="master-filter__label-title">
          {label}
        </label>
        <div className="master-filter__slider-badge-wrap">
          <span className="master-filter__slider-badge">
            {val !== undefined ? `≤ ${formatDurationMinutes(val)}` : "Any duration"}
          </span>
          {val !== undefined && (
            <button
              type="button"
              className="master-filter__slider-reset-btn"
              onClick={() => setVal(undefined)}
              title="Reset to any duration"
              aria-label="Reset duration filter"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Mini Histogram Bars showing density distribution */}
      <div
        className="master-filter__histogram"
        role="presentation"
        aria-hidden="true"
      >
        {DISTRIBUTION_CURVE.map((relativeHeight, idx) => {
          const barTime = min + (idx / (totalBars - 1)) * (max - min);
          const isActive = barTime <= currentThreshold;
          const heightPercent = Math.max(12, Math.round(relativeHeight * 100));

          return (
            <div
              key={idx}
              className={`master-filter__histogram-bar ${
                isActive ? "master-filter__histogram-bar--active" : ""
              }`}
              style={{ height: `${heightPercent}%` }}
              title={`≤ ${formatDurationMinutes(Math.round(barTime))}`}
              onClick={() => {
                const steppedTime = Math.min(
                  max,
                  Math.max(min, Math.round(barTime / step) * step),
                );
                setVal(steppedTime);
              }}
            />
          );
        })}
      </div>

      <input
        id={name}
        name={name}
        data-filter-active={val !== undefined ? "true" : "false"}
        type="range"
        min={min}
        max={max}
        step={step}
        value={val ?? max}
        onChange={(e) => setVal(Number(e.target.value))}
        className="master-filter__range-slider"
      />

      <div className="master-filter__slider-ticks">
        <span>{formatDurationMinutes(min)}</span>
        <span>{formatDurationMinutes(max)}</span>
      </div>
    </div>
  );
}

