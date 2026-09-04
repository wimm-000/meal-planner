import { expect, test } from "@playwright/test";

test("renders the server foundation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Plan the week. Shop once. Eat well." }),
  ).toBeVisible();
  await expect(page.getByText("React Router 7")).toBeVisible();
  await expect(page.getByText("Netlify serverless")).toBeVisible();
});

test("can create an account and receive a personal Space", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  await page.goto("/signup");
  await page.getByLabel("Name").fill("E2E Planner");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("a-secure-password");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText("E2E Planner's Space")).toBeVisible();
  await expect(page.getByLabel("Space")).toHaveValue(/.+/);

  await page.getByRole("button", { name: "Switch" }).click();

  await expect(page.getByText("E2E Planner's Space")).toBeVisible();
});
