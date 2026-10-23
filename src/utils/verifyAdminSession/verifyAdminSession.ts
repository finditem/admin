import "server-only";
import { cookies } from "next/headers";
import { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";

/** 백엔드에 확인한 요청자의 관리자 여부입니다. */
export type AdminSession =
  | { status: "admin"; userId: number }
  /** 액세스 토큰이 없거나 만료돼 백엔드가 401을 돌려준 경우입니다. 토큰을 재발급하면 다시 확인할 수 있습니다. */
  | { status: "unauthorized" }
  /** 관리자가 아니거나 확인 자체에 실패한 경우입니다. */
  | { status: "denied" };

/**
 * 요청한 사람이 관리자 계정인지 백엔드에 확인합니다.
 *
 * @remarks
 * - 미들웨어는 토큰을 서명 검증 없이 디코드만 하므로, 서버의 비밀 키로 데이터를 가져오는 화면은 그리기 전에 백엔드 `/users/me`로 한 번 더 확인합니다.
 * - 액세스 토큰 만료(401)와 그 밖의 실패를 나눠 돌려줘, 화면이 토큰 재발급 뒤 다시 확인할지 고를 수 있게 합니다.
 */
export const verifyAdminSession = async (): Promise<AdminSession> => {
  const accessToken = (await cookies()).get("access_token")?.value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiUrl) return { status: "denied" };
  if (!accessToken) return { status: "unauthorized" };

  try {
    const response = await fetch(`${apiUrl}/users/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
      cache: "no-store",
    });
    if (response.status === 401) return { status: "unauthorized" };
    if (!response.ok) return { status: "denied" };

    const data = (await response.json()) as GetUsersMeResponse;
    return data.result?.role === "ADMIN"
      ? { status: "admin", userId: data.result.userId }
      : { status: "denied" };
  } catch {
    return { status: "denied" };
  }
};
