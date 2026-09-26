import { isoWeekToMonday } from "./isoWeekToMonday";

describe("isoWeekToMonday", () => {
  it("ISO 주차를 그 주 월요일로 바꿈", () => {
    expect(isoWeekToMonday("202639")).toBe("2026-09-21");
    expect(isoWeekToMonday("202601")).toBe("2025-12-29");
    expect(isoWeekToMonday("202053")).toBe("2020-12-28");
  });
});
