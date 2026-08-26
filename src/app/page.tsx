import { headers } from "next/headers";
import { resolveNearestHub } from "@/features/homepage/domain/homepage-geo";
import { DEFAULT_ORIGIN_HUB } from "@/features/homepage/domain/homepage-routes-data";
import { HomepageScreen } from "@/features/homepage/presentation/homepage-screen";

export const metadata = {
  title: { absolute: "Direct flight routes worldwide | Tripways" },
  description: "Discover direct flights by origin and explore Tripways destination coverage.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const headerStore = await headers();
  const city = headerStore.get("cf-ipcity") || headerStore.get("x-vercel-ip-city");
  const countryCode = headerStore.get("cf-ipcountry");
  const latitude = headerStore.get("cf-iplatitude");
  const longitude = headerStore.get("cf-iplongitude");

  const initialHub =
    resolveNearestHub({
      city,
      countryCode,
      latitude,
      longitude,
    }) ?? DEFAULT_ORIGIN_HUB;

  return <HomepageScreen initialHub={initialHub} />;
}
