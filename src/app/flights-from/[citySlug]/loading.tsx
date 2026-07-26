import { SectionFallback } from "@/features/city-page";

/**
 * Preserves the City Hub page structure while the required overview streams.
 */
export default function LoadingCityPage() {
  return (
    <main className="page-shell city-page">
      <SectionFallback label="city direct flights" />
      <SectionFallback label="route discovery" />
    </main>
  );
}
