export type ClientLogLevel = "info" | "warn" | "error";

export type ClientLogContext = {
  feature?: string;
  action?: string;
  component?: string;
  [key: string]: unknown;
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
];

function isSensitive(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[-_]/g, "");
  return SENSITIVE_KEY_PATTERNS.some((pattern) =>
    normalized.includes(pattern.replace(/[-_]/g, ""))
  );
}

function sanitizeClientContext(
  context?: ClientLogContext,
): Record<string, unknown> | undefined {
  if (!context) return undefined;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(context)) {
    if (isSensitive(k)) {
      result[k] = "[redacted]";
    } else if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      result[k] = sanitizeClientContext(v as ClientLogContext);
    } else {
      result[k] = v;
    }
  }
  return result;
}

export const clientLogger = {
  info(message: string, context?: ClientLogContext): void {
    if (process.env.NODE_ENV === "test") return;
    const safeContext = sanitizeClientContext(context);
    console.info(`[TripwaysClient:INFO] ${message}`, safeContext ?? "");
  },

  warn(message: string, context?: ClientLogContext): void {
    if (process.env.NODE_ENV === "test") return;
    const safeContext = sanitizeClientContext(context);
    console.warn(`[TripwaysClient:WARN] ${message}`, safeContext ?? "");
  },

  error(message: string, error?: unknown, context?: ClientLogContext): void {
    if (process.env.NODE_ENV === "test") return;
    const safeContext = sanitizeClientContext(context);
    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    console.error(`[TripwaysClient:ERROR] ${message}`, {
      error: errorDetails,
      ...safeContext,
    });
  },
};
