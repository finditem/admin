"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGetUsersMe } from "@/api/fetch/user";
import AdminNotice from "../../../AdminNotice/AdminNotice";

/**
 * 서버가 액세스 토큰 만료로 관리자 확인에 실패했을 때, 토큰을 재발급한 뒤 통계를 다시 그리게 합니다.
 *
 * @remarks
 * - `/users/me` 요청이 401이면 `authApi`가 토큰을 재발급하고, 재발급에도 실패하면 로그인 화면으로 보냅니다.
 * - 관리자 확인이 끝나면 한 번만 `router.refresh()`로 서버 컴포넌트를 다시 그려 반복 요청을 막습니다.
 */
const AnalyticsSessionRefresh = () => {
  const router = useRouter();
  const { data } = useGetUsersMe();
  const hasRefreshed = useRef(false);
  const isAdmin = data?.result?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin || hasRefreshed.current) return;
    hasRefreshed.current = true;
    router.refresh();
  }, [isAdmin, router]);

  return (
    <AdminNotice
      title="관리자 계정을 확인하고 있어요"
      description="확인이 끝나면 통계가 표시돼요."
    />
  );
};

export default AnalyticsSessionRefresh;
