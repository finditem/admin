import { test, expect } from "@playwright/test";
import { ADMIN_ACCESS_TOKEN } from "./helpers/admin";

const USER_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiVVNFUiIsInVzZXJJZCI6MiwiZXhwIjo5OTk5OTk5OTk5fQ.fake-signature";

test.describe("관리자 로그인 (/login)", () => {
  test("토큰 없이 루트에 접근하면 로그인 화면이 표시된다", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByPlaceholder("이메일을 입력해 주세요")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호를 입력해 주세요")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
  });

  test("아이디 또는 비밀번호가 틀리면 안내 토스트가 표시된다", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          isSuccess: false,
          code: "AUTH401-INVALID_CREDENTIALS",
          message: "Unauthorized",
          result: null,
        }),
      })
    );

    await page.goto("/login");
    await page.getByPlaceholder("이메일을 입력해 주세요").fill("admin@example.com");
    await page.getByPlaceholder("비밀번호를 입력해 주세요").fill("wrong-password");
    await page.getByRole("button", { name: "로그인" }).click();

    await expect(page.getByText("아이디 또는 비밀번호가 일치하지 않아요")).toBeVisible();
  });

  test("관리자 권한이 없는 계정은 로그인 화면으로 돌아오고 안내 토스트가 표시된다", async ({
    context,
    page,
  }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: USER_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);

    await page.goto("/admin");

    await expect(page).toHaveURL(/\/login\?reason=forbidden$/);
    await expect(page.getByText("관리자 권한이 있는 계정으로 로그인해 주세요.")).toBeVisible();
  });

  test("관리자 계정으로 로그인 화면에 접근하면 관리자 메인으로 이동한다", async ({
    context,
    page,
  }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);

    await page.goto("/login");

    await expect(page).toHaveURL(/\/admin$/);
  });
});
