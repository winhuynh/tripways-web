"use client";

export default function AirportPageError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main>
      <h1>Something went wrong while loading this airport.</h1>
      <p>The local data service is temporarily unavailable.</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
