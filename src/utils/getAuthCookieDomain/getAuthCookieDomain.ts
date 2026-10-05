const AUTH_COOKIE_PARENT_DOMAIN = "finditem.kr";

/**
 * 토큰 쿠키를 지울 때 붙일 `domain` 값을 접속 호스트로 판정합니다.
 *
 * @remarks
 * - 백엔드가 finditem.kr 계열 요청에는 토큰 쿠키를 상위 도메인으로 발급하므로, 지울 때도 같은 도메인을 줘야 지워집니다.
 * - dev 서버는 middleware의 `nextUrl`을 자기 주소로 만들기 때문에 `Host` 헤더를 넘겨 판정합니다.
 *
 * @param host - 요청의 `Host` 헤더 값 (포트 포함 가능)
 * @returns finditem.kr 또는 그 하위 도메인이면 `".finditem.kr"`, 아니면 `undefined`
 *
 * @example
 * ```ts
 * getAuthCookieDomain("a.finditem.kr"); // ".finditem.kr"
 * getAuthCookieDomain("localhost:3000"); // undefined
 * ```
 */
export const getAuthCookieDomain = (host: string | null) => {
  const hostname = host?.split(":")[0] ?? "";
  return hostname === AUTH_COOKIE_PARENT_DOMAIN ||
    hostname.endsWith(`.${AUTH_COOKIE_PARENT_DOMAIN}`)
    ? `.${AUTH_COOKIE_PARENT_DOMAIN}`
    : undefined;
};
