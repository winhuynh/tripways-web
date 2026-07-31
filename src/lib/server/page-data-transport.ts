import "server-only";

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
  try {
    const response = await (input.fetchImpl ?? fetch)(input.url, {
      method: "POST",
      headers: {
        apikey: input.anonKey,
        authorization: `Bearer ${input.anonKey}`,
        "content-type": "application/json",
        "x-tripways-read-contract": "page-data-v1",
      },
      body: JSON.stringify(input.body),
      signal: controller.signal,
      next: {
        revalidate: 3600,
        tags: [input.cacheIdentity],
      },
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      const code = readErrorCode(payload);
      if (code && input.notFoundCodes.includes(code)) {
        throw input.createError(code);
      }
      throw input.createError(input.unavailableCode);
    }
    try {
      return input.parse(payload);
    } catch {
      throw input.createError(input.unavailableCode);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === input.unavailableCode ||
        input.notFoundCodes.includes(error.message))
    ) {
      throw error;
    }
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
