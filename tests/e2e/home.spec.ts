import { expect, test } from "@playwright/test";

test("renders the server foundation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Plan the week. Shop once. Eat well." }),
  ).toBeVisible();
  await expect(page.getByText("React Router 7")).toBeVisible();
  await expect(page.getByText("Netlify serverless")).toBeVisible();
});
