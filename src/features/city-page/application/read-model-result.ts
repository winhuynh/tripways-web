export type ReadModelResult<T> =
  | Readonly<{ status: "available"; data: T }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "unavailable" }>;

/**
 * Executes an optional read model and converts transport failures or empty
 * values into render-safe section states.
 */
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
