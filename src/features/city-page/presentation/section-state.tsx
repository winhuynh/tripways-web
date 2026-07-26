/**
 * Preserves a section's place in the page while an independent read model
 * streams through Suspense.
 */
export function SectionFallback({ label }: { label: string }) {
  return (
    <section aria-label={`${label} loading`} className="section-card section-skeleton">
      <span>Loading {label.toLowerCase()}…</span>
    </section>
  );
}

/**
 * Communicates a local read failure without blocking the remaining City Hub
 * sections.
 */
export function SectionUnavailable({ title }: { title: string }) {
  return (
    <section className="section-card section-message">
      <h2>{title}</h2>
      <p>This information is temporarily unavailable. Other city data remains accessible.</p>
    </section>
  );
}
