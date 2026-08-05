"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="pseo-page">
      <section className="pseo-container pseo-section" aria-labelledby="page-error-heading">
        <p className="pseo-eyebrow">Tripways data service</p>
        <h1 id="page-error-heading">Flight information is temporarily unavailable</h1>
        <p>We could not load verified route data right now. Please try again shortly.</p>
        <button type="button" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
