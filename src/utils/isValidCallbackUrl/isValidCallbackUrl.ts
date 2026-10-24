const CALLBACK_BASE = "http://callback.invalid";

/**
 * 주어진 값이 안전한 내부 콜백 URL인지 검사합니다.
 *
 * - `/`로 시작해야 합니다.
 * - `//` 또는 `/\`로 시작하는 경우 Open Redirect 공격 방지를 위해 거부합니다.
 * - 탭, 줄바꿈 같은 제어 문자가 있으면 거부합니다. 브라우저는 URL을 해석할 때 이 문자를 지우므로 `/\t/evil.com`이 `//evil.com`이 됩니다.
 * - 브라우저와 같은 방식으로 해석한 결과가 다른 출처를 가리키면 거부합니다.
 * - `/login` 경로는 순환 리다이렉트 방지를 위해 거부합니다.
 *
 * @param url - 검사할 값
 * @returns 안전한 내부 경로이면 `true`, 아니면 `false`
 * @author suhyeon
 */
export const isValidCallbackUrl = (url: unknown): url is string =>
  typeof url === "string" &&
  /^\/(?!\/|\\)/.test(url) &&
  !/[\u0000-\u001F\u007F]/.test(url) &&
  new URL(url, CALLBACK_BASE).origin === CALLBACK_BASE &&
  !url.startsWith("/login");
