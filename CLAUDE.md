# FI-ADMIN

[찾아줘!](https://www.finditem.kr/) 서비스의 관리자 페이지 프론트엔드. 운영 앱(`finditem/FI-FE`)의 `/admin` 라우트를 별도 저장소로 분리한 Next.js 15(App Router) 단일 앱이다.

## 스택

- Next.js 15 / React 19 / TypeScript 5 (`next.config.ts`에서 `reactCompiler: true` — React Compiler 활성화)
- Tailwind CSS 3 (디자인 토큰은 `src/utils/tokens/tailwind.config.js`, FI-DS에서 생성된 값)
- 테스트: Jest(단위), Playwright(e2e, `tests/e2e`). e2e는 API를 `page.route`로 흉내 내고 `src/mock/data`의 목데이터를 쓴다.
- 패키지 매니저: pnpm(`package.json`의 `packageManager`). npm과 npx 대신 `pnpm add`, `pnpm exec`를 쓴다.
- 운영 앱과 달리 next-intl, Sentry, PWA, Capacitor, MSW, Storybook, ESLint는 넣지 않았다. 어드민은 한국어 전용이므로 문구는 번역 함수 없이 한국어로 작성한다.

## 구조

```
src/
  app/
    (admin)/admin/  # 관리자 영역 (/admin/...)
    (auth)/login/   # 로그인
    */              # 라우트별 _components _hooks _types _utils (private 폴더)
  components/       # 전역 공통
  hooks/ utils/ types/ constants/  # 도메인 구분 없이 종류별 최상위에 분산
  api/              # _base(axios, react-query 래퍼)와 fetch/<도메인>
  middleware.ts     # 계정 권한별 영역 이동
  mock/
```

- 계정 권한(role)별 영역은 `src/app`의 라우트 그룹 하나로 묶고, `src/constants/ROLE_AREAS.ts`에 권한과 첫 화면을 등록한다. 미들웨어가 이 목록으로 접근을 검사하고 로그인 후 이동할 곳을 정한다. B2B 같은 영역을 추가할 때도 같은 방식을 따르며, 모노레포로 나누지 않는다.
- 게시글 상세, 공지 상세, 비밀번호 변경처럼 운영 앱에만 있는 화면으로 연결할 때는 `getServiceUrl`로 절대 주소를 만든다.
- 라우트 전용 코드는 해당 라우트 폴더 하위 `_components`/`_hooks`/`_types`/`_utils`(private 폴더)에 둔다. 여러 라우트에서 재사용되면 그때 `src/components`, `src/hooks` 등 전역 폴더로 올린다.
- `hooks/`, `store/`, `utils/`는 도메인별로 묶지 않고, 함수/훅 하나당 폴더 하나(`utils/cn/`, `hooks/useLogout/` 등)로 세분화하는 컨벤션이다. 새 유틸/훅을 추가할 때도 이 패턴을 따른다.
- `_components` 하위 컴포넌트도 동일하게 컴포넌트 하나당 폴더 하나. 그 컴포넌트 내부에서만 쓰는 하위 조각은 `_internal` 폴더에 둔다.
- 운영 앱에서 코드를 옮겨올 때도 위 구조를 그대로 따른다. `useTranslations`를 쓰던 공통 컴포넌트는 한국어 문구로 바꿔 넣는다.

## 커밋 컨벤션 (commitlint 강제)

- type: `feat`, `fix`, `docs`, `hotfix`, `refactor`, `test`, `chore`, `rename`, `asset`, `design`, `a11y` 중 하나
- scope 필수 (비워두면 커밋 실패)
- 예: `feat(report): 신고 목록 필터 추가`

## 검증 커맨드

- 기본: `pnpm test` + `pnpm build` (타입체크 포함). 대부분의 회귀를 이 둘로 잡는다.
- e2e: `pnpm build` 뒤 `CI=1 E2E_PORT=3918 pnpm test:e2e`. `CI`를 주면 dev 서버 대신 빌드 결과로 서버를 띄우고, 포트를 바꿔 켜 둔 dev 서버와 겹치지 않게 한다.
- 타입만 확인하면 되는 경우는 `pnpm exec tsc --noEmit`으로 대신한다. dev 서버가 켜져 있을 때 `pnpm build`를 돌리면 같은 `.next`를 덮어써 dev 런타임이 깨진다.

## 텍스트 작성 원칙

커밋 메시지, PR 본문, 코드 주석 등 Claude가 작성하는 모든 텍스트 산출물은 온전한 문장으로만 작성하고 이모티콘을 사용하지 않는다.

## React Compiler와 메모이제이션

이 프로젝트는 React Compiler가 켜져 있다(`next.config.ts`의 `reactCompiler: true`). 컴포넌트/훅 내부에서 `useMemo`, `useCallback`을 수동으로 작성하지 않는다 — 컴파일러가 자동으로 처리한다. 새 훅이나 컴포넌트를 작성할 때도, 기존 코드를 참고해 복사할 때도 이 패턴을 넣지 않는다. 외부 라이브러리 API가 메모이즈된 함수/값을 명시적으로 요구하는 경우처럼 컴파일러가 커버하지 못하는 예외적 상황에서만 사용하고, 그 경우 왜 필요한지 주석으로 남긴다.

## 표준 작업 흐름

1. 기존 코드 패턴과 디렉토리 구조를 그대로 따른다. 새 추상화나 새로운 디렉토리 규칙을 임의로 만들지 않는다.
2. `pnpm dev`는 사용자가 이미 띄워서 켜둔 상태라고 가정한다. Claude가 직접 실행하지 않는다 — 장기 실행 프로세스라 포트 충돌이나 좀비 프로세스를 남길 수 있다.
3. 로컬 `git commit`은 응답 흐름에 맞춰 자율적으로 수행할 수 있다. 단, 이번 응답에서 Claude가 Edit/Write로 직접 건드린 파일만 `git add`한다 (`git add -A`/`git add .` 금지). 커밋 직전 `git status`로 staging 대상이 의도한 파일과 정확히 일치하는지 확인한다.
4. `git push`, PR 생성 등 원격 저장소에 영향을 주는 작업은 사용자가 명시적으로 요청하기 전에는 수행하지 않는다. force-push는 요청 여부와 관계없이 수행하지 않는다.

## PR 생성

사용자가 PR 생성을 요청하면 `create-pr` 스킬을 실행한다. `gh pr create` 실행 자체는 항상 사용자 확인 후 진행한다 (위 4번 규칙).

## 라우트 작업 계획

특정 라우트(`page.tsx`가 있는 디렉토리) 하나에 국한된 작업을 시작하기 전에 `plan-route` 스킬을 실행한다. 해당 라우트 폴더의 `_docs/plan.md`에 작업 항목을 todo 체크리스트로 기록하고 진행에 따라 갱신해, 세션이 끊겨도 다음 세션이나 다른 팀원이 이어받을 수 있게 한다. 여러 라우트에 걸친 작업이나 전역 공통 코드(`src/components`, `src/hooks` 등) 작업에는 적용하지 않는다.
