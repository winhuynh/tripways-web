"use client";

type FareInputRowProps = Readonly<{
  name: string;
  label?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  placeholder?: string;
}>;

export function FareInputRow({
  name,
  label = "Maximum one-way fare",
  defaultValue,
  min = 1,
  max = 100000,
  placeholder = "e.g. 250",
}: FareInputRowProps) {
  return (
    <div className="master-filter__field">
      <label htmlFor={name} className="master-filter__label-title">
        {label}
      </label>
      <div className="master-filter__fare-wrap">
        <span className="master-filter__fare-prefix" aria-hidden="true">
          $
        </span>
        <input
          id={name}
          name={name}
          type="number"
          min={min}
          max={max}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="master-filter__fare-input"
        />
        <span className="master-filter__fare-suffix">USD</span>
      </div>
    </div>
  );
}
