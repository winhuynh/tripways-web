"use client";

import { useState } from "react";

type Option = Readonly<{
  value: string;
  label: string;
}>;

type SegmentedTabRowProps = Readonly<{
  name: string;
  label: string;
  options: readonly Option[];
  defaultValue?: string;
}>;

export function SegmentedTabRow({
  name,
  label,
  options,
  defaultValue = options[0]?.value ?? "",
}: SegmentedTabRowProps) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="master-filter__field">
      <span className="master-filter__label-title">{label}</span>
      <div className="master-filter__segmented" role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <label
              key={opt.value}
              className={`master-filter__segmented-item ${
                isSelected ? "master-filter__segmented-item--active" : ""
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => setSelected(opt.value)}
                className="master-filter__sr-only"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
