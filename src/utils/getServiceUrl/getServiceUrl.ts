const DEFAULT_SERVICE_URL = "https://www.finditem.kr";

/**
 * 운영 앱(찾아줘!)의 절대 URL을 만듭니다.
 *
 * @remarks
 * - 게시글 상세, 공지 상세, 비밀번호 변경처럼 운영 앱에만 있는 화면으로 연결할 때 사용합니다.
 * - `NEXT_PUBLIC_SERVICE_URL`이 없으면 운영 도메인을 사용합니다.
 *
 * @example
 * ```ts
 * getServiceUrl("/notice/1"); // "https://www.finditem.kr/notice/1"
 * ```
 */

export const getServiceUrl = (path: string) => {
  const baseUrl = (process.env.NEXT_PUBLIC_SERVICE_URL || DEFAULT_SERVICE_URL).replace(/\/$/, "");
  return `${baseUrl}${path}`;
};
