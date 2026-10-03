import { getAuthCookieDomain } from "./getAuthCookieDomain";

describe("getAuthCookieDomain", () => {
  it.each(["finditem.kr", "www.finditem.kr", "a.finditem.kr", "a.finditem.kr:443"])(
    "%s이면 상위 도메인을 반환한다",
    (host) => {
      expect(getAuthCookieDomain(host)).toBe(".finditem.kr");
    }
  );

  it.each(["localhost:3000", "evilfinditem.kr", "finditem.kr.evil.com", ""])(
    "%s이면 도메인을 붙이지 않는다",
    (host) => {
      expect(getAuthCookieDomain(host)).toBeUndefined();
    }
  );

  it("Host 헤더가 없으면 도메인을 붙이지 않는다", () => {
    expect(getAuthCookieDomain(null)).toBeUndefined();
  });
});
