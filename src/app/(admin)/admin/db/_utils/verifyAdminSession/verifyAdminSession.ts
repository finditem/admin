import "server-only";
import { cookies } from "next/headers";
import { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";

/**
 * 요청한 사람이 관리자 계정인지 백엔드에 확인합니다.
 *
 * @remarks
 * - 미들웨어는 토큰을 서명 검증 없이 디코드만 하므로, DB를 조회하기 전에는 백엔드 `/users/me`로 한 번 더 확인합니다.
 * - 액세스 토큰이 만료됐거나 확인에 실패하면 `false`를 돌려줍니다.
 */
export const verifyAdminSession = async () => {
  const accessToken = (await cookies()).get("access_token")?.value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!accessToken || !apiUrl) return false;

  try {
    const response = await fetch(`${apiUrl}/users/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return false;

    const data = (await response.json()) as GetUsersMeResponse;
    return data.result?.role === "ADMIN";
  } catch {
    return false;
  }
};
