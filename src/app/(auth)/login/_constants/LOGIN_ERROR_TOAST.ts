import { ToastType } from "@/types/ToastTypes";

/** 로그인 API 에러 코드별 토스트 문구와 종류입니다. */
export const LOGIN_ERROR_TOAST: Record<string, { message: string; type: ToastType }> = {
  COMMON400: { message: "잘못된 요청이에요. 다시 시도해 주세요.", type: "warning" },
  "AUTH401-INVALID_CREDENTIALS": {
    message: "아이디 또는 비밀번호가 일치하지 않아요",
    type: "warning",
  },
  COMMON500: { message: "서버에러로 관리자에게 문의 해주세요.", type: "error" },
  ERR_BAD_REQUEST: { message: "잘못된 요청이에요.", type: "warning" },
};
