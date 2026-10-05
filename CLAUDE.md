# FI-ADMIN

[찾아줘!](https://www.finditem.kr/) 서비스의 관리자 페이지 프론트엔드다. 운영 앱(`finditem/FI-FE`)의 `/admin` 라우트를 별도 저장소로 분리한 Next.js 15(App Router) 단일 앱이며, 운영 주소는 https://a.finditem.kr 이다.

스택은 Next.js 15, React 19, TypeScript 5, Tailwind CSS 3, Jest(단위), Playwright(e2e), pnpm이다. 운영 앱과 달리 next-intl, Sentry, PWA, Capacitor, MSW, Storybook, ESLint는 넣지 않았다.

## 절대 규칙

아래 두 규칙은 다른 어떤 지시보다 우선한다. 사용자가 요청하더라도 어기지 않으며, `.claude/settings.json`에 등록된 훅이 실제로 막는다. 훅에 막히면 우회 방법을 찾지 말고 사용자에게 상황을 설명한다.

### 1. 환경 변수 파일에 접근하지 않는다

- `.env`, `.env.local`, `.env.example` 등 `.env` 계열 파일은 읽기, 수정, 생성, 복사, 이동, 검색, 내용 출력을 모두 하지 않는다. `cat`, `grep`, `sed`, `node -e`, `source`, `dotenv`, `printenv`, `vercel env` 같은 간접 경로도 마찬가지다.
- `.env`를 읽는 스크립트를 따로 써서 실행하는 식으로 우회하지 않는다.
- 저장소 전체를 재귀로 grep할 때는 `--include`로 확장자를 좁히거나 Grep 도구를 쓴다. 재귀 grep은 `.gitignore`를 무시해 `.env` 내용까지 읽는다.
- 환경 변수 값이 필요하거나 env 때문에 생긴 문제로 보이면 사용자에게 직접 확인해 달라고 요청한다.
- 막는 훅은 `.claude/hooks/guard-env.mjs`이고 개발자를 포함해 누구도 끌 수 없다.

### 2. 작업은 `.claude/worktrees` 아래 `work/` 브랜치 워크트리에서만 한다

이 저장소는 비개발자도 Claude로 작업한다. 메인 워킹 디렉토리나 `preview`에서 바로 고치지 않도록 다음 순서를 반드시 지킨다.

1. 파일을 고치기 전에 `bash .claude/scripts/new-preview-worktree.sh <작업-이름>`을 실행한다. 작업 이름은 영문 소문자와 하이픈으로 짓는다(예: `notice-banner-text`). 스크립트가 최신 `origin/preview`에서 `work/<작업-이름>` 브랜치를 만들어 `.claude/worktrees/<작업-이름>/`에 체크아웃하고, 필요한 설정 파일을 복사한다.
2. 이후 모든 수정과 명령은 그 워크트리 경로 안에서 한다. 같은 작업을 이어서 할 때는 기존 워크트리를 쓰고 새로 만들지 않는다.
3. 화면 확인이 필요하면 사용자에게 그 워크트리 경로에서 `pnpm dev`를 직접 실행해 달라고 안내한다.
4. 커밋과 push는 사용자에게 무엇을 바꿨는지 설명하고 허락을 받은 뒤에 한다. push는 `work/` 브랜치로만 하고, `preview`와 `main`으로 push하거나 force push하거나 PR을 머지하지 않는다. `preview` 반영은 개발자가 PR 리뷰를 거쳐 한다.
5. 비개발자에게 설명할 때는 git 용어를 줄이고, 무엇이 바뀌었는지와 어디서 확인하면 되는지를 먼저 말한다.

막는 훅은 `.claude/hooks/guard-preview-branch.mjs`다. 개발자는 개인 파일인 `.claude/settings.local.json`에 `{"env": {"FI_ADMIN_DEVELOPER": "1"}}`을 넣어 이 훅만 끄고 `feat/`, `fix/` 등 기존 브랜치 흐름으로 작업할 수 있다. 이 훅이 켜진 상태에서는 `.claude/hooks`, `.claude/scripts`, `.claude/settings.json`도 수정할 수 없다.

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

<important if="빌드, 테스트, 타입체크를 실행하거나 패키지를 설치할 때">

패키지 매니저는 pnpm이다. npm과 npx 대신 `pnpm add`, `pnpm exec`를 쓴다.

| 명령 | 용도 |
|---|---|
| `pnpm test` | Jest 단위 테스트 |
| `pnpm build` | 프로덕션 빌드(타입체크 포함). `pnpm test`와 함께 기본 검증이다 |
| `pnpm exec tsc --noEmit` | 타입만 확인할 때 `pnpm build` 대신 쓴다 |
| `CI=1 E2E_PORT=3918 pnpm test:e2e` | `pnpm build` 뒤에 실행하는 e2e. `CI`를 주면 빌드 결과로 서버를 띄우고, 포트를 바꿔 dev 서버와 겹치지 않게 한다 |
| `pnpm dev` | 사용자가 이미 띄워 둔 상태라고 가정한다. Claude는 직접 실행하지 않는다 |

dev 서버가 켜져 있을 때 `pnpm build`를 돌리면 같은 `.next`를 덮어써 dev 런타임이 깨진다.
</important>

<important if="작업을 시작하기 전이거나, 작업을 끝내고 커밋을 보고하거나 PR을 만들기 전">

다른 사람이 먼저 반영한 변경과 어긋나거나 충돌을 PR 단계에서야 발견하지 않도록 원격 `preview`의 최신 내용을 받는다.

- `git fetch origin --prune`을 실행한다. 새 작업은 최신 `origin/preview`에서 워크트리를 만든다(`new-preview-worktree.sh`는 이 fetch를 스스로 한다).
- 기존 워크트리에서 이어서 작업하거나 작업을 끝냈을 때는 워킹트리가 깨끗한지 확인한 뒤 그 워크트리에서 `git merge origin/preview`로 합친다.
- 메인 워킹 디렉토리의 `preview`도 `git -C <저장소 루트> pull --ff-only origin preview`로 맞춘다. 커밋되지 않은 변경이 있거나 fast-forward가 안 되면 건드리지 않고 사용자에게 알린다.
- 이미 push한 브랜치를 rebase하면 force push가 필요해지므로 rebase가 아니라 merge로 한다.
- merge에서 충돌이 나면 임의로 해결하지 말고 충돌한 파일과 양쪽 변경 내용을 사용자에게 보여주고 어떻게 합칠지 확인받는다.
</important>

<important if="page.tsx가 있는 라우트 하나에 국한된 작업을 시작할 때">
- 구현 전에 `plan-route` 스킬을 실행한다. 라우트 폴더의 `_docs/plan.md`에 작업 항목을 todo 체크리스트로 기록하고 진행에 따라 갱신해, 세션이 끊겨도 다음 세션이나 다른 팀원이 이어받을 수 있게 한다.
- 여러 라우트에 걸친 작업이나 전역 공통 코드(`src/components`, `src/hooks` 등) 작업에는 적용하지 않는다.
</important>

<important if="새 파일이나 폴더를 만들거나 코드를 다른 위치로 옮길 때">
- 새 추상화나 새로운 디렉토리 규칙을 임의로 만들지 않는다.
- 라우트 전용 코드는 해당 라우트 폴더 하위 `_components`/`_hooks`/`_types`/`_utils`(private 폴더)에 둔다. 여러 라우트에서 재사용되면 그때 `src/components`, `src/hooks` 등 전역 폴더로 올린다.
- `hooks/`, `store/`, `utils/`는 도메인별로 묶지 않고 함수/훅 하나당 폴더 하나(`utils/cn/`, `hooks/useLogout/` 등)로 나눈다.
- `_components` 하위 컴포넌트도 컴포넌트 하나당 폴더 하나다. 그 컴포넌트 내부에서만 쓰는 하위 조각은 `_internal` 폴더에 둔다.
</important>

<important if="운영 앱(finditem/FI-FE)에서 코드를 옮겨올 때">
- 이 저장소의 구조 규칙을 그대로 따른다.
- `useTranslations`를 쓰던 공통 컴포넌트는 한국어 문구로 바꿔 넣는다.
</important>

<important if="화면에 보이는 문구를 추가하거나 수정할 때">
- 어드민은 한국어 전용이다. 번역 함수 없이 한국어로 직접 작성한다.
</important>

<important if="React 컴포넌트나 훅을 작성하거나 수정할 때">
- React Compiler가 켜져 있다(`next.config.ts`의 `reactCompiler: true`). `useMemo`, `useCallback`을 수동으로 작성하지 않고, 기존 코드를 복사할 때도 넣지 않는다.
- 외부 라이브러리 API가 메모이즈된 값을 명시적으로 요구하는 경우처럼 컴파일러가 커버하지 못할 때만 쓰고, 그 이유를 주석으로 남긴다.
</important>

<important if="스타일, 색상, 간격 등 Tailwind 클래스를 다룰 때">
- 디자인 토큰은 FI-DS에서 생성된 `src/utils/tokens/tailwind.config.js`에 있다.
</important>

<important if="API 요청이나 응답 타입을 다루거나 서버가 내려주는 필드를 확인해야 할 때">
- FE 타입만 보고 판단하지 않는다. 개발 서버 OpenAPI JSON을 인증 없이 `https://dev-api.finditem.kr/v3/api-docs`에서 받아 확인한다. 사람이 볼 문서는 https://dev-api.finditem.kr/swagger-ui/index.html 이다.
</important>

<important if="계정 권한(role)별 영역을 추가하거나 로그인 후 이동, 접근 제어를 다룰 때">
- 권한별 영역은 `src/app`의 라우트 그룹 하나로 묶고, `src/constants/ROLE_AREAS.ts`에 권한과 첫 화면을 등록한다. 미들웨어가 이 목록으로 접근을 검사하고 로그인 후 이동할 곳을 정한다.
- B2B 같은 영역을 추가할 때도 같은 방식을 따르며 모노레포로 나누지 않는다.
</important>

<important if="게시글 상세, 공지 상세, 비밀번호 변경처럼 운영 앱에만 있는 화면으로 연결할 때">
- `getServiceUrl`로 절대 주소를 만든다.
</important>

<important if="테스트를 작성하거나 수정할 때">
- e2e(`tests/e2e`)는 API를 `page.route`로 흉내 내고 `src/mock/data`의 목데이터를 쓴다.
</important>

<important if="커밋 메시지, PR 본문, 코드 주석을 작성할 때">
- 온전한 문장으로만 작성하고 이모티콘을 사용하지 않는다.
</important>

<important if="git commit을 할 때">
- 메시지 형식은 husky의 commit-msg 훅에서 commitlint가 검사한다. 허용 type과 scope 필수 규칙은 `commitlint.config.cjs`를 본다. 예: `feat(report): 신고 목록 필터 추가`
- 로컬 커밋은 응답 흐름에 맞춰 자율적으로 할 수 있다. 단, 이번 응답에서 Claude가 Edit/Write로 직접 건드린 파일만 `git add`한다(`git add -A`/`git add .` 금지). 커밋 직전 `git status`로 staging 대상이 의도한 파일과 정확히 일치하는지 확인한다.
</important>

<important if="git push, PR 생성 등 원격 저장소에 영향을 주는 작업을 할 때">
- 사용자가 명시적으로 요청하기 전에는 하지 않는다. force push는 요청 여부와 관계없이 하지 않는다.
- PR 생성을 요청받으면 `create-pr` 스킬을 실행한다. `gh pr create` 실행 자체는 항상 사용자 확인 후 진행한다.
</important>

<important if="PR을 만들거나 기능과 테스트를 함께 고친 작업을 정리할 때">
- 기능 PR에는 기능 코드만 담고, 단위 테스트(Jest)와 e2e 테스트 추가나 수정은 별도의 `test` 타입 PR로 올린다.
- 두 PR은 브랜치도 따로 만든다. 테스트 PR은 기능 브랜치에서 갈라 만들고, 본문에 대상 기능 PR 번호를 적는다.
- 기능 변경 때문에 기존 테스트가 깨져 CI가 실패하는 경우에도 테스트 수정은 테스트 PR로 분리하고, 기능 PR 본문에 깨지는 테스트와 테스트 PR 번호를 밝힌다.
- 한 작업에서 기능과 테스트를 함께 고쳤다면 PR을 만들기 전에 사용자에게 어떻게 나눌지 보여주고 확인을 받는다.
- 제목 맨 앞에 `[기능]` 또는 `[테스트]`를 붙이고 본문의 `PR 종류` 섹션에서 해당 항목을 체크한다. 예: `[기능] feat: 신고 목록 필터 추가`, `[테스트] test: 신고 목록 필터 테스트 추가`.
</important>
