import { expect, test } from "@playwright/test";

test.describe("Acceptance:enter-data", () => {
  test("test basic rendering", async ({ page }) => {
    await page.goto("/enter-data");

    await expect(page).toHaveTitle(/Resume Craft: Your Custom Resume Solution/);
    await expect(page.getByTestId("global__header")).toBeVisible();
    await expect(page.getByTestId("global__footer")).toBeVisible();
  });

  test("test header behaviour", async ({ page }) => {
    await page.goto("/enter-data");

    const currentTheme = await page.locator("html").getAttribute("class");
    const newExpectedTheme = currentTheme === "light" ? "dark" : "light";

    await expect(page.getByTestId("global__header")).toBeVisible();
    // const page2Promise = page.waitForEvent("popup");
    await page.click("header a");
    // const page2 = await page2Promise;
    await expect(page).toHaveURL("/");
    await page.goBack();

    await page.click("header button");

    const actualNewTheme = await page.locator("html").getAttribute("class");

    expect(actualNewTheme).toStrictEqual(newExpectedTheme);
  });

  // Todo:
  // - Add test for footer behaviour
  // - Add test for the forms behaviour
});
