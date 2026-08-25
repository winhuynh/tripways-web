import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// ─── Cloudflare caching strategy ─────────────────────────────────────────────
//
// Cloudflare does NOT cache HTML by default — you must create a Cache Rule in
// the Cloudflare dashboard:
//   Rules → Cache Rules → Create rule
//     Match: hostname + path "/flights-from/*" (repeat for each PSEO pattern)
//     Cache status: "Eligible for cache"
//     Edge TTL: "Use Cache-Control header" OR set "Override" to 86400 s
//
// Header split:
//   Cloudflare-CDN-Cache-Control → controls Cloudflare's edge cache only (24 h)
//   Cache-Control                → controls the browser cache only (5 min)
//
// This way the browser re-checks with Cloudflare every 5 minutes, but Cloudflare
// serves cached HTML to the browser for up to 24 hours before going back to origin.
// ─────────────────────────────────────────────────────────────────────────────

/** Tells Cloudflare's edge to cache the response for 24 h. */
const CF_CDN_CACHE = "public, max-age=86400";

/**
 * Tells the browser to cache locally for 5 minutes, then revalidate with
 * Cloudflare (which will serve from its own edge cache for up to 24 h).
 */
const BROWSER_CACHE = "public, max-age=300";

const PSEO_HEADERS = [
  { key: "Cloudflare-CDN-Cache-Control", value: CF_CDN_CACHE },
  { key: "Cache-Control", value: BROWSER_CACHE },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/flights-from/:slug*", headers: PSEO_HEADERS },
      { source: "/flights/:slug*",      headers: PSEO_HEADERS },
      { source: "/airports/:slug*",     headers: PSEO_HEADERS },
    ];
  },
};

export default nextConfig;

if (process.env.ENABLE_CLOUDFLARE_DEV === "true") {
  try {
    initOpenNextCloudflareForDev();
  } catch {
    // Ignore wrangler filesystem permission errors in isolated dev environments
  }
}
