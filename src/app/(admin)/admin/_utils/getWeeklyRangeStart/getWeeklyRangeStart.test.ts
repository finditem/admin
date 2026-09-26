import { getWeeklyRangeStart } from "./getWeeklyRangeStart";

describe("getWeeklyRangeStart", () => {
  it("이번 주를 포함한 최근 N주의 첫 월요일을 구함", () => {
    // 2026-09-26(토) 한국 시간 오후
    const now = new Date("2026-09-26T07:00:00Z");

    expect(getWeeklyRangeStart(now, 1)).toBe("2026-09-21");
    expect(getWeeklyRangeStart(now, 12)).toBe("2026-07-06");
  });

  it("UTC로는 일요일이어도 한국 시간으로 월요일이면 그 주부터 셈", () => {
    // 2026-09-28(월) 00:30 KST = 2026-09-27(일) 15:30 UTC
    const now = new Date("2026-09-27T15:30:00Z");

    expect(getWeeklyRangeStart(now, 1)).toBe("2026-09-28");
  });
});
