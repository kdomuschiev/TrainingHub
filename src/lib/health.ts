export type Health = {
  status: "ok" | "error";
  database: "reachable" | "unreachable";
};

export async function checkHealth(
  pingDatabase: () => Promise<unknown>,
  logFailure: (message: string) => void = () => {},
): Promise<Health> {
  try {
    await pingDatabase();
    return { status: "ok", database: "reachable" };
  } catch (error) {
    // The message only: database errors can carry the connection details.
    logFailure(error instanceof Error ? error.message : String(error));
    return { status: "error", database: "unreachable" };
  }
}
