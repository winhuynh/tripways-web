export type RpcEnvelope = Readonly<{
  data: unknown;
  meta: unknown;
  error: unknown;
}>;

export function readRpcData(value: unknown): unknown {
  if (!isRecord(value) || !("data" in value) || !("error" in value)) {
    throw new Error("ERR_INVALID_RPC_ENVELOPE");
  }
  if (value.error !== null) {
    const code = readErrorCode(value.error);
    throw new Error(code ?? "ERR_INVALID_RPC_ENVELOPE");
  }
  return value.data;
}

function readErrorCode(value: unknown): string | null {
  if (!isRecord(value)) return null;
  return typeof value.code === "string" ? value.code : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
