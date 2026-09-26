import { formatDbCell } from "./formatDbCell";

describe("formatDbCell", () => {
  it("null과 undefined는 빈 문자열과 구분되도록 NULL로 적는다", () => {
    expect(formatDbCell(null)).toBe("NULL");
    expect(formatDbCell(undefined)).toBe("NULL");
    expect(formatDbCell("")).toBe("");
  });

  it("객체와 배열은 JSON 문자열로 적는다", () => {
    expect(formatDbCell({ a: 1 })).toBe('{"a":1}');
    expect(formatDbCell([1, 2])).toBe("[1,2]");
  });

  it("숫자와 불리언은 문자열로 바꾼다", () => {
    expect(formatDbCell(0)).toBe("0");
    expect(formatDbCell(false)).toBe("false");
  });
});
