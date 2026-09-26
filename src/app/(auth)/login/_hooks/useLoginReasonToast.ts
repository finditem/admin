import { useEffect, useRef } from "react";
import { useToast } from "@/context/ToastContext";
import { LOGIN_REASON_TOAST } from "../_constants/LOGIN_REASON_TOAST";

/**
 * 로그인 화면으로 보내진 이유(`reason` 쿼리)가 있으면 안내 토스트를 한 번 띄웁니다.
 *
 * @remarks
 * - 세션 만료(`session-expired`)와 권한 없음(`forbidden`)을 안내합니다.
 * - 쿠키 정리는 미들웨어가 담당합니다.
 *
 * @param reason - 로그인 화면으로 보내진 이유(`reason` 쿼리)
 */

const useLoginReasonToast = (reason?: string) => {
  const { addToast } = useToast();
  const isShown = useRef(false);

  useEffect(() => {
    const toast = reason ? LOGIN_REASON_TOAST[reason] : undefined;
    if (!toast || isShown.current) return;

    isShown.current = true;
    addToast(toast.message, toast.type);
  }, [reason, addToast]);
};

export default useLoginReasonToast;
