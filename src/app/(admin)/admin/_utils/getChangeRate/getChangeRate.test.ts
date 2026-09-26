import { getChangeRate } from "./getChangeRate";

describe("getChangeRate", () => {
  it("이전 값 대비 증감률을 정수 퍼센트로 구함", () => {
    expect(getChangeRate(30, 24)).toBe(25);
    expect(getChangeRate(18, 24)).toBe(-25);
    expect(getChangeRate(24, 24)).toBe(0);
    expect(getChangeRate(1, 3)).toBe(-67);
  });

  it("이전 값이 0이면 null", () => {
    expect(getChangeRate(5, 0)).toBeNull();
    expect(getChangeRate(0, 0)).toBeNull();
  });
});
