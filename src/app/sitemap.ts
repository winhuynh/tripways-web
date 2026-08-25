import type { MetadataRoute } from "next";

import { readApplicationEnvironment } from "@/lib/server/application-environment";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = new URL(readApplicationEnvironment().siteUrl);

  return ["/", "/about", "/accessibility", "/contact", "/cookies", "/privacy", "/terms"].map(
    (path) => ({ url: new URL(path, siteUrl).toString() }),
  );
}
