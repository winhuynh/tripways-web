import { getHomepageStatistics } from "@/features/homepage/application/get-homepage";
import { HomepageScreen } from "@/features/homepage/presentation/homepage-screen";

export const metadata = {
  title: { absolute: "Direct flight routes worldwide | Tripways" },
  description: "Discover direct flights by origin and explore Tripways destination coverage.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  return <HomepageScreen model={await getHomepageStatistics()} />;
}
