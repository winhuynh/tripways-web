import "server-only";

import { serverLogger } from "./logger";

type CacheIdentityInput = {
  locale: string;
  entityIdentity: string;
  filters: Record<string, unknown>;
  dataVersion: string;
};

type PageDataRequest<T> = {
  url: string;
  anonKey: string;
  body: unknown;
  cacheIdentity: string;
  timeoutMs: number;
  notFoundCodes: readonly string[];
  unavailableCode: string;
  createError(code: string): Error;
  parse(value: unknown): T;
  fetchImpl?: typeof fetch;
};

export function buildPageDataCacheIdentity(input: CacheIdentityInput): string {
  return [
    "page-data",
    input.dataVersion,
    input.locale,
    input.entityIdentity,
    stableStringify(input.filters),
  ].join(":");
}

export async function requestPageData<T>(input: PageDataRequest<T>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs);
  const requestId = crypto.randomUUID();
  const startTime = performance.now();

  try {
    const cacheOptions = process.env.NODE_ENV === "development"
      ? { cache: "no-store" as const }
      : {
          next: {
            // Cache fetch responses for 24 h in the Next.js Data Cache.
            // On-demand revalidation via revalidateTag() can purge earlier if needed.
            revalidate: 86400,
            tags: [input.cacheIdentity],
          },
        };
    const response = await (input.fetchImpl ?? fetch)(input.url, {
      method: "POST",
      headers: {
        apikey: input.anonKey,
        authorization: `Bearer ${input.anonKey}`,
        "content-type": "application/json",
        "x-tripways-read-contract": "page-data-v1",
        "x-request-id": requestId,
      },
      body: JSON.stringify(input.body),
      signal: controller.signal,
      ...cacheOptions,
    });

    const payload: unknown = await response.json();
    const durationMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const code = readErrorCode(payload);
      serverLogger.warn("PAGE_DATA_FETCH_UNSUCCESSFUL", payload, {
        url: input.url,
        status: String(response.status),
        durationMs,
        cacheIdentity: input.cacheIdentity,
        requestId,
        errorCode: code ?? input.unavailableCode,
      });

      if (code && input.notFoundCodes.includes(code)) {
        throw input.createError(code);
      }
      throw input.createError(input.unavailableCode);
    }

    try {
      const parsed = input.parse(payload);
      serverLogger.info("PAGE_DATA_FETCH_SUCCESS", {
        url: input.url,
        durationMs,
        cacheIdentity: input.cacheIdentity,
        requestId,
      });
      return parsed;
    } catch (parseError) {
      serverLogger.error("PAGE_DATA_PARSE_ERROR", parseError, {
        url: input.url,
        durationMs,
        cacheIdentity: input.cacheIdentity,
        requestId,
        errorCode: input.unavailableCode,
      });
      throw input.createError(input.unavailableCode);
    }
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    if (
      error instanceof Error &&
      (error.message === input.unavailableCode ||
        input.notFoundCodes.includes(error.message))
    ) {
      throw error;
    }
    serverLogger.error("PAGE_DATA_NETWORK_ERROR", error, {
      url: input.url,
      durationMs,
      cacheIdentity: input.cacheIdentity,
      requestId,
      errorCode: input.unavailableCode,
    });
    throw input.createError(input.unavailableCode);
  } finally {
    clearTimeout(timeout);
  }
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (typeof value !== "object" || value === null) return JSON.stringify(value);
  return `{${Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
    .join(",")}}`;
}

function readErrorCode(value: unknown): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const error = (value as Record<string, unknown>).error;
  if (typeof error !== "object" || error === null || Array.isArray(error)) return null;
  const code = (error as Record<string, unknown>).code;
  return typeof code === "string" ? code : null;
}
