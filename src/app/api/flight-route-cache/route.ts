import { NextResponse } from "next/server";
import { extractServerRequestId, serverLogger } from "@/lib/server/logger";
import { readPageDataEnvironment } from "@/lib/server/page-data-environment";

export async function POST(request: Request) {
  const requestId = extractServerRequestId(request);
  const startTime = performance.now();
  const logContext = {
    requestId,
    feature: "flight-route-cache",
    method: "POST",
  };

  try {
    const body: unknown = await request.json();
    const environment = readPageDataEnvironment();
    const response = await fetch(environment.routeCacheUrl, {
      method: "POST",
      headers: {
        apikey: environment.supabaseAnonKey,
        authorization: `Bearer ${environment.supabaseAnonKey}`,
        "content-type": "application/json",
        "x-request-id": requestId,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload: unknown = await response.json();
    const durationMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      serverLogger.warn("ROUTE_CACHE_FAILED_UPSTREAM", payload, {
        ...logContext,
        status: String(response.status),
        durationMs,
      });
      return NextResponse.json(
        { error: "ERR_ROUTE_CACHE_UNAVAILABLE" },
        { status: response.status >= 500 ? 502 : response.status, headers: { "x-request-id": requestId } },
      );
    }

    serverLogger.info("ROUTE_CACHE_SUCCESS", {
      ...logContext,
      durationMs,
    });

    return NextResponse.json(payload, {
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    serverLogger.error("ROUTE_CACHE_EXCEPTION", error, {
      ...logContext,
      durationMs,
    });
    return NextResponse.json(
      { error: "ERR_ROUTE_CACHE_FAILED" },
      { status: 500, headers: { "x-request-id": requestId } },
    );
  }
}
