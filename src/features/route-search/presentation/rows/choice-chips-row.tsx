"use client";

import { useState } from "react";

type ChipOption = Readonly<{
  value: string;
  label: string;
}>;

type ChoiceChipsRowProps = Readonly<{
  name: string;
  label: string;
  options: readonly ChipOption[];
  defaultValue?: string;
}>;

export function ChoiceChipsRow({
  name,
  label,
  options,
  defaultValue = options[0]?.value ?? "",
}: ChoiceChipsRowProps) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="master-filter__field">
      <span className="master-filter__label-title">{label}</span>
      <div className="master-filter__chips-grid" role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const isSelected = String(selected) === String(opt.value);
          return (
            <label
              key={opt.value}
              className={`master-filter__choice-chip ${
                isSelected ? "master-filter__choice-chip--selected" : ""
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
