import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { extractServerRequestId, serverLogger } from "@/lib/server/logger";

/**
 * POST /api/revalidate
 *
 * Purges a specific tag from the Next.js Data Cache on demand.
 * Call this after an ingestion pipeline run to immediately refresh stale page data
 * without waiting for the 24-hour ISR window to expire.
 *
 * Body: { tag: string; secret: string }
 *
 * Tag formats:
 *   page:city:<slug>:en-GB            → city page data
 *   page:airport:<iata>:en-GB         → airport page data
 *   page:route:<slug>:en-GB           → route page data
 *   route-search:<json-request>       → route search results
 *   route-map-v1:<slug>:get_route_map → route map data
 *
 * Environment variable required:
 *   REVALIDATE_SECRET — shared secret to prevent unauthorized cache purges
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = extractServerRequestId(request);
  const startTime = performance.now();
  const logContext = {
    requestId,
    feature: "cache-revalidate",
    method: "POST",
  };

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    serverLogger.warn("REVALIDATE_INVALID_JSON", { ...logContext, errorCode: "ERR_INVALID_BODY" });
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: { "x-request-id": requestId } },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).secret !== "string" ||
    typeof (body as Record<string, unknown>).tag !== "string"
  ) {
    serverLogger.warn("REVALIDATE_INVALID_REQUEST_SHAPE", { ...logContext, errorCode: "ERR_INVALID_SHAPE" });
    return NextResponse.json(
      { error: "Body must be { tag: string; secret: string }" },
      { status: 400, headers: { "x-request-id": requestId } },
    );
  }

  const { tag, secret } = body as { tag: string; secret: string };

  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    serverLogger.warn("REVALIDATE_UNAUTHORIZED_ATTEMPT", {
      ...logContext,
      tag,
      errorCode: "ERR_UNAUTHORIZED",
    });
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "x-request-id": requestId } },
    );
  }

  revalidateTag(tag, "max");
  const durationMs = Math.round(performance.now() - startTime);

  serverLogger.info("REVALIDATE_TAG_SUCCESS", {
    ...logContext,
    tag,
    durationMs,
  });

  return NextResponse.json(
    { revalidated: true, tag },
    { headers: { "x-request-id": requestId } },
  );
}
