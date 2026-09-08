function createFallbackSvg(code: string): string {
  const safeCode = (code || "??").slice(0, 2).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#F1F5F9"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="22" fill="#475569">${safeCode}</text>
</svg>`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ iata: string }> }
): Promise<Response> {
  const { iata } = await context.params;
  const normalized = (iata ?? "").trim().toUpperCase();

  if (!normalized || !/^[A-Z0-9]{2}$/.test(normalized)) {
    return new Response(createFallbackSvg(normalized), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  }

  const upstreamUrl = `https://pics.avs.io/200/200/${normalized}.png`;

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      next: { revalidate: 2592000 }, // Next.js fetch cache: 30 days
    });

    if (upstreamRes.ok) {
      const contentType = upstreamRes.headers.get("content-type") || "image/png";
      const imageBuffer = await upstreamRes.arrayBuffer();

      return new Response(imageBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=2592000, s-maxage=31536000, immutable",
          "CDN-Cache-Control": "max-age=31536000",
          "Cloudflare-CDN-Cache-Control": "max-age=31536000",
        },
      });
    }
  } catch {
    // Upstream network error -> fallback to SVG
  }

  return new Response(createFallbackSvg(normalized), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
