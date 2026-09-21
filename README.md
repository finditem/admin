# FI-ADMIN

[찾아줘!](https://www.finditem.kr/) 서비스의 관리자 페이지입니다. 운영 앱([finditem/FI-FE](https://github.com/finditem/FI-FE))의 `/admin` 라우트를 별도 저장소로 분리했습니다.

## 시작하기

```bash
pnpm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL 설정
pnpm dev
```

`pnpm dev`와 `pnpm build`는 실행 전에 아이콘 스프라이트(`public/icons/sprite.svg`)를 다시 생성합니다.

## 환경변수

| 이름                      | 설명                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`     | 백엔드 API 주소입니다. 브라우저 요청은 `/api` 프록시(`next.config.ts`의 rewrites)를 거칩니다.             |
| `NEXT_PUBLIC_SERVICE_URL` | 운영 앱 주소입니다. 운영 앱에만 있는 화면으로 연결할 때 씁니다. 기본값은 `https://www.finditem.kr`입니다. |

## 인증과 영역

- `/login`에서 운영 앱과 같은 이메일 로그인 API로 로그인합니다. 인증 쿠키는 `/api` 프록시를 거쳐 어드민 도메인에 저장됩니다.
- `src/middleware.ts`가 `access_token`의 `role`을 읽어 `src/constants/ROLE_AREAS.ts`에 등록된 영역으로 보냅니다. 현재 영역은 ADMIN(`/admin`) 하나입니다.
- 영역마다 `src/app`의 라우트 그룹을 하나씩 둡니다. 예를 들어 어드민은 `src/app/(admin)/admin`입니다. B2B 같은 영역을 추가할 때는 라우트 그룹을 만들고 `ROLE_AREAS`에 한 줄을 추가합니다.

## 스크립트

| 명령            | 설명                                                         |
| --------------- | ------------------------------------------------------------ |
| `pnpm dev`      | 개발 서버                                                    |
| `pnpm build`    | 프로덕션 빌드(타입 검사 포함)                                |
| `pnpm test`     | Jest 단위 테스트                                             |
| `pnpm test:e2e` | Playwright e2e 테스트. `E2E_PORT`로 포트를 바꿀 수 있습니다. |

## 디자인 토큰

`src/utils/tokens/tailwind.config.js`는 [finditem/FI-DS](https://github.com/finditem/FI-DS)의 동기화 워크플로가 PR로 갱신합니다. 직접 수정하지 않습니다.
