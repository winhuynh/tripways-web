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

export function DurationSliderRow({
  name,
  label,
  min,
  max,
  step,
  initialValue,
}: DurationSliderRowProps) {
  const [val, setVal] = useState<number | undefined>(initialValue);

  return (
    <div className="master-filter__slider-field">
      <div className="master-filter__slider-header">
        <label htmlFor={name} className="master-filter__label-title">
          {label}
        </label>
        <span className="master-filter__slider-badge">
          {val ? `≤ ${formatDurationMinutes(val)}` : "Any duration"}
        </span>
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
