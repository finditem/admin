import { ToastType } from "@/types/ToastTypes";

/** 로그인 화면으로 보내진 이유(`reason` 쿼리)별 안내 토스트입니다. */
export const LOGIN_REASON_TOAST: Record<string, { message: string; type: ToastType }> = {
  "session-expired": { message: "세션이 만료되었어요. 다시 로그인 해주세요.", type: "warning" },
  forbidden: { message: "관리자 권한이 있는 계정으로 로그인해 주세요.", type: "warning" },
};
