"use client";

import { useEffect } from "react";
import { clientLogger } from "@/lib/client/client-logger";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    clientLogger.error("PAGE_ERROR_BOUNDARY_TRIGGERED", error, {
      component: "ErrorPage",
      digest: error?.digest,
    });
  }, [error]);

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
