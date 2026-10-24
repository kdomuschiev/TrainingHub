export type Health = {
  status: "ok" | "error";
  database: "reachable" | "unreachable";
};

export async function checkHealth(
  pingDatabase: () => Promise<unknown>,
): Promise<Health> {
  void pingDatabase;
  return { status: "error", database: "unreachable" };
}
