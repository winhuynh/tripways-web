"use client";

export default function CityPageError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main>
      <h1>Something went wrong while loading this city.</h1>
      <p>The local data service is temporarily unavailable.</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
