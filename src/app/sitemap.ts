import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  return ["/", "/about", "/accessibility", "/contact", "/cookies", "/privacy", "/terms"].map(
    (path) => ({ url: new URL(path, siteUrl).toString() }),
  );
}
