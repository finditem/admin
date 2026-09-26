import { getSingleSearchParam } from "./getSingleSearchParam";

describe("getSingleSearchParam", () => {
  it("문자열은 그대로 돌려준다", () => {
    expect(getSingleSearchParam("forbidden")).toBe("forbidden");
  });

  it("배열이면 첫 번째 값을 돌려준다", () => {
    expect(getSingleSearchParam(["/admin", "/admin/notice"])).toBe("/admin");
  });

  it("값이 없으면 undefined를 돌려준다", () => {
    expect(getSingleSearchParam(undefined)).toBeUndefined();
  });
});
