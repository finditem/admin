# login 작업 계획

- [x] 로그인 폼 최소 높이를 헤더 전제의 `h-base`(`calc(100dvh - 56px)`)에서 `min-h-dvh`로 바꿔, body 좌우 테두리가 화면 맨 아래까지 이어지게 한다

## 로고 로딩 개선 (2026-09-27)

로고가 늦게 뜨는 원인은 두 가지다. 폼 훅이 `useSearchParams`를 써서 `<Suspense>` 안쪽 폼 전체가 서버에서 그려지지 않았고, 로고는 `Icon`의 `React.lazy`로 폼 JS 실행 뒤 별도 청크로 한 번 더 받았다.

- [x] A. 로그인 폼 로고를 `Icon` 대신 `@/assets/logo.svg` 정적 import로 바꾼다
- [x] B-1. `useForm`/`FormProvider`를 `_components/AdminLoginFormProvider`로 옮기고 `reason`, `callbackUrl`을 props로 받는다
- [x] B-2. `useLoginReasonToast`, `useAdminLoginForm`에서 `useSearchParams`를 걷어내고 인자로 값을 받는다
- [x] B-3. `page.tsx`를 서버 컴포넌트로 바꿔 `searchParams`를 읽어 넘기고 `<Suspense>`를 없앤다
- [x] B-4. `searchParams` 값이 배열로 올 수 있어 `_utils/getSingleSearchParam`으로 첫 값만 쓰게 한다
