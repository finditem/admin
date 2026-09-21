export const FALLBACK_SRC = "/user/default-profile.svg";

const RENDERABLE_SRC_REGEX = /^(\/(?!\/)|https?:\/\/)/;

/**
 * 프로필 이미지로 쓸 수 있는 주소면 그대로, 아니면 기본 프로필 이미지 주소를 반환합니다.
 *
 * @remarks
 * - `next/image`는 `/`로 시작하는 상대 경로나 `http(s)://` 절대 주소가 아니면 렌더링 중에 에러를 던집니다.
 *   이 에러는 `onError`로 잡을 수 없으므로 렌더링 전에 걸러냅니다.
 * - API가 `"0"`처럼 주소가 아닌 값을 내려주는 경우를 대비합니다.
 *
 * @example
 * ```ts
 * getAvatarSrc("https://example.com/a.png"); // "https://example.com/a.png"
 * getAvatarSrc("0"); // "/user/default-profile.svg"
 * ```
 */

export const getAvatarSrc = (src?: string | null) => {
  const trimmed = src?.trim();
  return trimmed && RENDERABLE_SRC_REGEX.test(trimmed) ? trimmed : FALLBACK_SRC;
};
