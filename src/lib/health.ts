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
  } catch {
    return { status: "error", database: "unreachable" };
  }
}
