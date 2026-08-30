import "server-only";

export type ServerLogLevel = "info" | "warn" | "error";

export type ServerLogContext = {
  action?: string | null;
  status?: string | null;
  requestId?: string | null;
  feature?: string | null;
  path?: string | null;
  method?: string | null;
  durationMs?: number | null;
  errorCode?: string | null;
  [key: string]: unknown;
};

type ErrorLike = {
  name?: unknown;
  message?: unknown;
  stack?: unknown;
  code?: unknown;
  digest?: unknown;
};

const SENSITIVE_KEY_PATTERNS = [
  "token",
  "authorization",
  "apikey",
  "api_key",
  "secret",
  "password",
  "jwt",
  "cookie",
  "set-cookie",
  "bearer",
];

export function extractServerRequestId(request?: Request | null): string {
  if (!request) return crypto.randomUUID();
  const candidate =
    request.headers.get("x-request-id") ||
    request.headers.get("x-correlation-id") ||
    request.headers.get("client-request-id");
  if (candidate && candidate.trim().length > 0) {
    return candidate.trim().slice(0, 128);
  }
  return crypto.randomUUID();
}

export function sanitizeServerLogValue(value: unknown, depth = 0): unknown {
  if (depth > 5) return "[max_depth_exceeded]";
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    if (value.length > 500) {
      return `${value.slice(0, 500)}...[truncated]`;
    }
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeServerLogValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (isSensitiveServerKey(k)) {
        sanitized[k] = "[redacted]";
      } else {
        sanitized[k] = sanitizeServerLogValue(v, depth + 1);
      }
    }
    return sanitized;
  }

  return String(value);
}

function isSensitiveServerKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[-_]/g, "");
  return SENSITIVE_KEY_PATTERNS.some((pattern) =>
    normalized.includes(pattern.replace(/[-_]/g, ""))
  );
}

export function safeExtractServerError(
  error: unknown,
  fallbackCode?: string | null,
): {
  errorCode: string;
  errorName: string;
  errorMessage: string;
  errorStack?: string;
  digest?: string;
} {
  const errorLike = readServerErrorLike(error);
  const rawMessage =
    typeof errorLike?.message === "string"
      ? errorLike.message
      : String(error ?? "");
  const rawCode = typeof errorLike?.code === "string" ? errorLike.code : null;

  const normalizedCode =
    normalizeServerErrorCode(rawCode) ||
    normalizeServerErrorCode(rawMessage) ||
    normalizeServerErrorCode(fallbackCode) ||
    "ERR_INTERNAL";

  const errorName =
    typeof errorLike?.name === "string" && errorLike.name.trim().length > 0
      ? errorLike.name.trim()
      : "Error";

  const errorStack =
    typeof errorLike?.stack === "string" ? errorLike.stack : undefined;
  const digest =
    typeof errorLike?.digest === "string" ? errorLike.digest : undefined;

  return {
    errorCode: normalizedCode,
    errorName,
    errorMessage: rawMessage.slice(0, 1000),
    ...(errorStack ? { errorStack } : {}),
    ...(digest ? { digest } : {}),
  };
}

function readServerErrorLike(error: unknown): ErrorLike | null {
  if (error instanceof Error) {
    const rec = error as unknown as Record<string, unknown>;
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(rec.code ? { code: rec.code } : {}),
      ...(rec.digest ? { digest: rec.digest } : {}),
    };
  }
  if (typeof error === "object" && error !== null && !Array.isArray(error)) {
    return error as ErrorLike;
  }
  if (typeof error === "string") {
    return { message: error };
  }
  return null;
}

function normalizeServerErrorCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (/^ERR_[A-Z0-9_]+$/.test(trimmed)) return trimmed;
  if (/^[A-Z][A-Z0-9_]{2,}$/.test(trimmed)) return trimmed;
  return null;
}

function emitServerLog(
  level: ServerLogLevel,
  eventName: string,
  payload: Record<string, unknown>,
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event_name: eventName,
    ...payload,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export const serverLogger = {
  info(eventName: string, context: ServerLogContext = {}): void {
    const sanitized = sanitizeServerLogValue(context) as Record<string, unknown>;
    emitServerLog("info", eventName, sanitized);
  },

  warn(
    eventName: string,
    errorOrContext?: unknown,
    context: ServerLogContext = {},
  ): void {
    let payload: Record<string, unknown> = {};
    if (
      errorOrContext instanceof Error ||
      (typeof errorOrContext === "object" &&
        errorOrContext !== null &&
        "message" in errorOrContext)
    ) {
      const errorFields = safeExtractServerError(
        errorOrContext,
        context.errorCode,
      );
      payload = {
        ...((sanitizeServerLogValue(context) as Record<string, unknown>) || {}),
        error_code: errorFields.errorCode,
        error_name: errorFields.errorName,
        error_message: errorFields.errorMessage,
        ...(errorFields.digest ? { digest: errorFields.digest } : {}),
      };
    } else if (typeof errorOrContext === "object" && errorOrContext !== null) {
      payload = sanitizeServerLogValue({
        ...errorOrContext,
        ...context,
      }) as Record<string, unknown>;
    } else {
      payload = sanitizeServerLogValue(context) as Record<string, unknown>;
    }
    emitServerLog("warn", eventName, payload);
  },

  error(
    eventName: string,
    error: unknown,
    context: ServerLogContext = {},
  ): void {
    const errorFields = safeExtractServerError(error, context.errorCode);
    const payload: Record<string, unknown> = {
      ...((sanitizeServerLogValue(context) as Record<string, unknown>) || {}),
      error_code: errorFields.errorCode,
      error_name: errorFields.errorName,
      error_message: errorFields.errorMessage,
      ...(errorFields.errorStack ? { error_stack: errorFields.errorStack } : {}),
      ...(errorFields.digest ? { digest: errorFields.digest } : {}),
    };
    emitServerLog("error", eventName, payload);
  },
};
