import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ROLE_AREAS } from "@/constants/ROLE_AREAS";

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

const clearTokens = (response: NextResponse) => {
  response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  return response;
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const hasRefreshToken = request.cookies.has("refresh_token");
  const role = getRole(accessToken);
  const home = getHomeByRole(role);

  const redirectTo = (target: string) => NextResponse.redirect(new URL(target, request.url));

  const redirectToLogin = (withCallback: boolean) => {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (withCallback) loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  };

  // 권한이 없는 계정으로 로그인하면 토큰을 지우고 로그인 화면에 안내를 띄운다.
  const redirectForbidden = () => {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("reason", "forbidden");
    return clearTokens(NextResponse.redirect(loginUrl));
  };

  if (pathname.startsWith(LOGIN_PATH)) {
    const reason = request.nextUrl.searchParams.get("reason");
    if (reason === "session-expired") return clearTokens(NextResponse.next());
    if (reason !== "forbidden" && accessToken && hasRefreshToken && home) return redirectTo(home);
    return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
