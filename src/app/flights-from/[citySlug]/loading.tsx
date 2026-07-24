import { SectionFallback } from "@/features/city-page";

export default function LoadingCityPage() {
  return (
    <main className="page-shell city-page">
      <SectionFallback label="city direct flights" />
      <SectionFallback label="route discovery" />
    </main>
  );
}
