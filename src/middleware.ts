import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ROLE_AREAS } from "@/constants/ROLE_AREAS";
import { getAuthCookieDomain } from "@/utils/getAuthCookieDomain/getAuthCookieDomain";

interface JwtPayload {
  role?: string;
}

const LOGIN_PATH = "/login";

const getRole = (accessToken?: string) => {
  if (!accessToken) return null;
  try {
    return jwtDecode<JwtPayload>(accessToken).role ?? null;
  } catch {
    return null;
  }
};

const getHomeByRole = (role: string | null) =>
  ROLE_AREAS.find((area) => area.role === role)?.home ?? null;

const findArea = (pathname: string) =>
  ROLE_AREAS.find((area) => pathname === area.home || pathname.startsWith(`${area.home}/`));

/**
 * 페이지 응답에 붙일 CSP입니다.
 *
 * @remarks
 * - 스크립트는 요청마다 만든 nonce가 붙은 것과 그 스크립트가 불러온 것만 실행합니다. Next.js는 요청 헤더의 CSP에서 nonce를 읽어 자기 스크립트에 붙입니다.
 * - dev 서버는 React 디버깅에 eval을 쓰므로 개발 환경에서만 `'unsafe-eval'`을 허용합니다.
 */
const buildContentSecurityPolicy = (nonce: string) =>
  [
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

const clearTokens = (request: NextRequest, response: NextResponse) => {
  const domain = getAuthCookieDomain(request.headers.get("host"));
  response.cookies.set("access_token", "", { path: "/", maxAge: 0, domain });
  response.cookies.set("refresh_token", "", { path: "/", maxAge: 0, domain });
  return response;
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const hasRefreshToken = request.cookies.has("refresh_token");
  const role = getRole(accessToken);
  const home = getHomeByRole(role);

  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);

  // 화면을 그리는 응답에만 nonce와 CSP를 붙인다. 서버 컴포넌트는 x-nonce 요청 헤더로 nonce를 읽는다.
  const next = () => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", contentSecurityPolicy);
    return response;
  };

  const redirectTo = (target: string) => NextResponse.redirect(new URL(target, request.url));

  const redirectToLogin = (withCallback: boolean) => {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (withCallback) loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  };

  // 권한이 없는 계정이면 로그인 화면에 안내만 띄운다.
  // 토큰은 운영 앱과 공유하므로 여기서 지우면 운영 앱 세션까지 끊긴다.
  const redirectForbidden = () => {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("reason", "forbidden");
    return NextResponse.redirect(loginUrl);
  };

  if (pathname.startsWith(LOGIN_PATH)) {
    const reason = request.nextUrl.searchParams.get("reason");
    if (reason === "session-expired") return clearTokens(request, next());
    if (reason !== "forbidden" && accessToken && hasRefreshToken && home) return redirectTo(home);
    return next();
  }

  if (pathname === "/") {
    if (!accessToken || !hasRefreshToken) return redirectToLogin(false);
    return home ? redirectTo(home) : redirectForbidden();
  }

  const area = findArea(pathname);
  if (area) {
    if (!accessToken || !hasRefreshToken) return redirectToLogin(true);
    if (role !== area.role) return home ? redirectTo(home) : redirectForbidden();
  }

  return next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
