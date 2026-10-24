import { expect, test } from "@playwright/test";

test("GET /api/health reports the database as reachable", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: "ok", database: "reachable" });
});
