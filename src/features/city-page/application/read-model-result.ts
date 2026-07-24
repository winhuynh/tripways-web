export type ReadModelResult<T> =
  | Readonly<{ status: "available"; data: T }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "unavailable" }>;

export async function readOptionalModel<T>(
  operation: () => Promise<T>,
  isEmpty: (value: T) => boolean,
): Promise<ReadModelResult<T>> {
  try {
    const value = await operation();
    return isEmpty(value) ? { status: "empty" } : { status: "available", data: value };
  } catch {
    return { status: "unavailable" };
  }
}
