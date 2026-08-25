"use client";

import { useState } from "react";

type TimeBucket = "early_morning" | "morning" | "afternoon" | "evening";

const TIME_BUCKET_META: Record<
  TimeBucket,
  { icon: string; label: string; time: string }
> = {
  early_morning: {
    icon: "🌅",
    label: "Early morning",
    time: "00:00 – 06:00",
  },
  morning: {
    icon: "☀️",
    label: "Morning",
    time: "06:00 – 12:00",
  },
  afternoon: {
    icon: "🌤",
    label: "Afternoon",
    time: "12:00 – 18:00",
  },
  evening: {
    icon: "🌙",
    label: "Evening",
    time: "18:00 – 24:00",
  },
};

type TimeBucketChipsRowProps = Readonly<{
  name: string;
  label?: string;
  selected?: readonly string[];
}>;

export function TimeBucketChipsRow({
  name,
  label = "Departure time",
  selected = [],
}: TimeBucketChipsRowProps) {
  const [activeBuckets, setActiveBuckets] = useState<string[]>([...selected]);

  function toggle(bucket: string) {
    setActiveBuckets((prev) =>
      prev.includes(bucket)
        ? prev.filter((b) => b !== bucket)
        : [...prev, bucket],
    );
  }

  return (
    <fieldset className="master-filter__fieldset">
      <legend className="master-filter__legend">{label}</legend>
      <div className="master-filter__time-chips-grid">
        {(Object.keys(TIME_BUCKET_META) as TimeBucket[]).map((bucket) => {
          const meta = TIME_BUCKET_META[bucket];
          const isChecked = activeBuckets.includes(bucket);
          return (
            <label
              key={bucket}
              className={`master-filter__time-chip ${
                isChecked ? "master-filter__time-chip--selected" : ""
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={bucket}
                checked={isChecked}
                onChange={() => toggle(bucket)}
                className="master-filter__sr-only"
              />
              <span className="master-filter__time-chip-icon" aria-hidden="true">
                {meta.icon}
              </span>
              <div className="master-filter__time-chip-text">
                <span className="master-filter__time-chip-label">{meta.label}</span>
                <span className="master-filter__time-chip-sub">{meta.time}</span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
