import { NextResponse } from "next/server";
import { extractServerRequestId, serverLogger } from "@/lib/server/logger";
import { readPageDataEnvironment } from "@/lib/server/page-data-environment";

export async function POST(request: Request) {
  const requestId = extractServerRequestId(request);
  const startTime = performance.now();
  const logContext = {
    requestId,
    feature: "flight-affiliate-handoff",
    method: "POST",
  };

  try {
    const body: unknown = await request.json();
    const environment = readPageDataEnvironment();
    const response = await fetch(environment.affiliateHandoffUrl, {
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
    const data =
      typeof payload === "object" && payload !== null && !Array.isArray(payload)
        ? (payload as { data?: unknown }).data
        : null;

    if (
      !response.ok ||
      typeof data !== "object" ||
      data === null ||
      Array.isArray(data)
    ) {
      serverLogger.warn("AFFILIATE_HANDOFF_FAILED_UPSTREAM", payload, {
        ...logContext,
        status: String(response.status),
        durationMs,
        errorCode: "ERR_HANDOFF_UNAVAILABLE",
      });
      return NextResponse.json(
        { error: "ERR_HANDOFF_UNAVAILABLE" },
        { status: 404, headers: { "x-request-id": requestId } },
      );
    }

    const url = (data as { url?: unknown }).url;
    if (
      typeof url !== "string" ||
      !url.startsWith("https://www.aviasales.com/")
    ) {
      serverLogger.warn("AFFILIATE_HANDOFF_INVALID_URL", { url }, {
        ...logContext,
        durationMs,
        errorCode: "ERR_HANDOFF_UNAVAILABLE",
      });
      return NextResponse.json(
        { error: "ERR_HANDOFF_UNAVAILABLE" },
        { status: 404, headers: { "x-request-id": requestId } },
      );
    }

    serverLogger.info("AFFILIATE_HANDOFF_SUCCESS", {
      ...logContext,
      durationMs,
    });

    return NextResponse.json({ url }, {
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    serverLogger.error("AFFILIATE_HANDOFF_EXCEPTION", error, {
      ...logContext,
      durationMs,
      errorCode: "ERR_HANDOFF_UNAVAILABLE",
    });
    return NextResponse.json(
      { error: "ERR_HANDOFF_UNAVAILABLE" },
      { status: 404, headers: { "x-request-id": requestId } },
    );
  }
}
