import type { AdFormat, AdPlacement } from "../domain/ad-placement";

/**
 * Reserves an accessible, provider-agnostic advertising placement. A future
 * ad integration can mount inside this stable UI boundary.
 */
export function AdSlot({
  format,
  placement,
}: {
  format: AdFormat;
  placement: AdPlacement;
}) {
  return (
    <aside
      aria-label="Advertisement"
      className={`ad-slot ad-slot--${format}`}
      data-ad-format={format}
      data-ad-placement={placement}
    >
      <p className="ad-slot__label">Advertisement</p>
      <p className="ad-slot__message">
        Tripways is supported by our partners. Relevant flight and travel offers may appear here.
      </p>
    </aside>
  );
}
