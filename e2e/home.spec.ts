import { expect, test } from "@playwright/test";

test("home page shows the Bulgarian placeholder", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "bg");
  await expect(page.getByRole("heading", { name: "TrainingHub" })).toBeVisible();
  await expect(page.getByText("Скоро тук: твоят екип от треньори.")).toBeVisible();
});
