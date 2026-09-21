/**
 * 계정 권한(role)별로 접근할 수 있는 영역과 로그인 후 첫 화면입니다.
 *
 * @remarks
 * - 영역은 `src/app`의 라우트 그룹 하나에 대응합니다. 예를 들어 ADMIN은 `(admin)/admin`입니다.
 * - B2B 같은 영역을 추가할 때는 라우트 그룹을 만들고 이 목록에 한 줄을 추가합니다.
 * - 미들웨어가 이 목록으로 영역 접근을 검사하므로 Edge 런타임에서 쓸 수 있는 값만 둡니다.
 */

export const ROLE_AREAS = [{ role: "ADMIN", home: "/admin" }] as const;

export type AreaRole = (typeof ROLE_AREAS)[number]["role"];
