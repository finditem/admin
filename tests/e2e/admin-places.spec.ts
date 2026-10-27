import { test, expect, Page } from "@playwright/test";
import { ADMIN_ACCESS_TOKEN, MOCK_AUTH_REFRESH } from "./helpers/admin";

const DAY_LABELS = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);

const okEnvelope = (result: unknown) => ({
  isSuccess: true,
  code: "200",
  message: "OK",
  result,
});

const MOCK_PLACE_DETAIL = {
  placeId: 11,
  name: "호호식당 성수",
  nameEn: null,
  type: "RESTAURANT",
  address: "서울 성동구 서울숲4길 25",
  addressEn: null,
  latitude: 37.5447,
  longitude: 127.0559,
  station: "성수역",
  stationEn: null,
  stationDistanceMeters: 400,
  thumbnailUrl:
    "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/thumb_33f80a6a-a_REST-005.jpg",
  operationPeriod: null,
  weeklySchedules: DAY_LABELS.map((_, index) => ({
    dayOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"][
      index
    ],
    isClosed: false,
    timeRanges: [{ type: "BUSINESS", startTime: "10:00", endTime: "20:00" }],
  })),
};

async function mockAuth(page: Page) {
  await page.route("**/api/auth/refresh", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_AUTH_REFRESH),
    })
  );
}

async function fillRequiredBasicFields(page: Page) {
  await page.getByPlaceholder("예: 성수 카페").fill("테스트 장소");
  await page.getByPlaceholder("예: 서울특별시 성동구 연무장길 1").fill("서울 성동구 테스트로 1");
  await page.getByPlaceholder("37.5421").fill("37.5447");
  await page.getByPlaceholder("127.0549").fill("127.0559");
  await page.getByPlaceholder("예: 성수역").fill("성수역");
  await page.getByPlaceholder("320").fill("300");
}

async function fillAllWeeklySchedules(page: Page) {
  for (const label of DAY_LABELS) {
    await page.getByLabel(`${label} 영업 시작 시간`).fill("10:00");
    await page.getByLabel(`${label} 영업 종료 시간`).fill("20:00");
  }
}

async function selectPlaceType(page: Page, label: string) {
  await page.getByText("장소 종류를 선택해 주세요.").click();
  await expect(page.getByRole("heading", { name: "장소 종류 선택" })).toBeVisible();
  await page.locator("label", { hasText: label }).click();
}

test.describe("관리자 장소 목록 페이지 (/admin/places)", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
    await mockAuth(page);
  });

  test("장소 목록이 표시된다", async ({ page }) => {
    await page.goto("/admin/places");

    await expect(page.getByRole("heading", { name: "성수 콘텐츠 관리", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "호호식당 성수" })).toBeVisible();
  });

  test("이름으로 검색하면 일치하는 장소만 표시된다", async ({ page }) => {
    await page.goto("/admin/places");

    await page.getByPlaceholder("장소 이름을 입력해 주세요.").fill("호호식당 성수");
    await page.getByPlaceholder("장소 이름을 입력해 주세요.").press("Enter");

    await expect(page.getByRole("heading", { name: "호호식당 성수" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "제스티살룬 성수" })).not.toBeVisible();
  });

  test("검색 결과가 없으면 빈 상태 메시지가 표시된다", async ({ page }) => {
    await page.goto("/admin/places");

    await page.getByPlaceholder("장소 이름을 입력해 주세요.").fill("존재하지않는장소");
    await page.getByPlaceholder("장소 이름을 입력해 주세요.").press("Enter");

    await expect(page.getByText("검색 결과가 없어요")).toBeVisible();
  });

  test("유형 필터 클릭 시 장소 유형 선택 팝업이 열린다", async ({ page }) => {
    await page.goto("/admin/places");

    await page.getByRole("button", { name: "전체 필터" }).click();

    await expect(page.getByRole("heading", { name: "장소 유형 선택" })).toBeVisible();
    await expect(page.getByRole("button", { name: "적용하기" })).toBeVisible();
  });

  test("삭제 확인 모달에서 확인을 누르면 목록에서 사라진다", async ({ page }) => {
    await page.route("**/api/admin/places/11", (route) => {
      if (route.request().method() !== "DELETE") return route.fallback();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope({ placeId: 11 })),
      });
    });

    await page.goto("/admin/places");

    const item = page.getByRole("heading", { name: "호호식당 성수" }).locator("..").locator("..");
    await item.getByRole("button", { name: "삭제" }).click();

    await expect(page.getByText("'호호식당 성수'을 삭제하시겠습니까?")).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "삭제" }).click();

    await expect(page.getByRole("heading", { name: "호호식당 성수" })).not.toBeVisible();
  });
});

test.describe("관리자 장소 등록 페이지 (/admin/places/new)", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
    await mockAuth(page);
  });

  test("필수 항목이 비어있으면 등록하기 버튼이 비활성화된다", async ({ page }) => {
    await page.goto("/admin/places/new");

    await expect(page.getByRole("button", { name: "등록하기" })).toBeDisabled();
  });

  test("모든 필수 항목을 입력하면 등록하기 버튼이 활성화되고, 제출 시 목록으로 이동한다", async ({
    page,
  }) => {
    await page.route("**/api/admin/places", (route) => {
      if (route.request().method() !== "POST") return route.fallback();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope({ placeId: 99 })),
      });
    });

    await page.goto("/admin/places/new");

    await selectPlaceType(page, "맛집");
    await fillRequiredBasicFields(page);
    await fillAllWeeklySchedules(page);
    await page
      .locator('input[type="file"]')
      .setInputFiles({ name: "thumbnail.png", mimeType: "image/png", buffer: TRANSPARENT_PNG });

    const submitButton = page.getByRole("button", { name: "등록하기" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await page.waitForURL("**/admin/places");
  });

  test("팝업 타입을 선택하면 운영 기간 입력이 추가로 나타난다", async ({ page }) => {
    await page.goto("/admin/places/new");

    await selectPlaceType(page, "팝업");

    await expect(page.getByText("운영 기간")).toBeVisible();
    await expect(page.getByLabel("운영 시작일")).toBeVisible();
    await expect(page.getByLabel("운영 종료일")).toBeVisible();
  });
});

test.describe("관리자 장소 수정 페이지 (/admin/places/[placeId]/edit)", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: "refresh_token", value: "fake-refresh-token", domain: "localhost", path: "/" },
      { name: "access_token", value: ADMIN_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);
    await mockAuth(page);
    await page.route("**/api/admin/places/11", (route) => {
      if (route.request().method() !== "GET") return route.fallback();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope(MOCK_PLACE_DETAIL)),
      });
    });
  });

  test("기존 장소 정보로 폼이 채워지고, 유형 선택은 비활성화된다", async ({ page }) => {
    await page.goto("/admin/places/11/edit");

    await expect(page.getByPlaceholder("예: 성수 카페")).toHaveValue("호호식당 성수");
    await expect(page.getByPlaceholder("예: 성수역")).toHaveValue("성수역");
    await expect(page.getByText("맛집")).toBeVisible();
    await expect(page.getByRole("button", { name: "장소 종류 선택" })).toHaveCount(0);
  });

  test("이름을 수정해 제출하면 목록으로 이동한다", async ({ page }) => {
    await page.route("**/api/admin/places/11", (route) => {
      if (route.request().method() !== "PUT") return route.fallback();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(okEnvelope(MOCK_PLACE_DETAIL)),
      });
    });

    await page.goto("/admin/places/11/edit");

    await expect(page.getByPlaceholder("예: 성수 카페")).toHaveValue("호호식당 성수");
    await page.getByPlaceholder("예: 성수 카페").fill("호호식당 성수 (수정)");

    const submitButton = page.getByRole("button", { name: "수정하기" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await page.waitForURL("**/admin/places");
  });
});
