"use client";

import { useEffect } from "react";
import { clientLogger } from "@/lib/client/client-logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    clientLogger.error("GLOBAL_ROOT_ERROR_TRIGGERED", error, {
      component: "GlobalError",
      digest: error?.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="pseo-page" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
          <section className="pseo-container pseo-section" aria-labelledby="global-error-heading">
            <p className="pseo-eyebrow">Tripways service error</p>
            <h1 id="global-error-heading">Something went wrong</h1>
            <p>An unexpected application error occurred. Please refresh or try again.</p>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: "4px",
                border: "1px solid currentColor",
              }}
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
