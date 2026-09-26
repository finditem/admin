import { useRef, useState, type BaseSyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import { useApiEmailLogin } from "@/api/fetch/auth";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { isValidCallbackUrl } from "@/utils";
import { AdminLoginFormType } from "../_types/AdminLoginFormType";
import { LOGIN_ERROR_TOAST } from "../_constants/LOGIN_ERROR_TOAST";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 관리자 로그인 폼의 제출을 처리하는 훅입니다.
 *
 * @remarks
 * - 운영 앱과 같은 이메일 로그인 API를 호출합니다. 쿠키는 `/api` 프록시를 거쳐 어드민 도메인에 저장됩니다.
 * - 로그인에 성공하면 `callbackUrl`이 안전한 내부 경로일 때 그곳으로, 아니면 `/`로 이동합니다.
 *   `/`에서는 미들웨어가 계정 권한에 맞는 영역으로 보냅니다.
 * - 요청 중이거나 이동 중일 때는 중복 제출을 막습니다.
 *
 * @param callbackUrl - 로그인 후 돌아갈 경로(`callbackUrl` 쿼리)
 */

const useAdminLoginForm = (callbackUrl?: string) => {
  const { handleSubmit } = useFormContext<AdminLoginFormType>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutateAsync: emailLoginMutateAsync, isPending } = useApiEmailLogin();
  const isSubmittingRef = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const submitLogin = handleSubmit(async ({ email, password }) => {
    if (!EMAIL_REGEX.test(email)) {
      addToast("이메일 형식을 확인해 주세요.", "warning");
      return;
    }

    try {
      await emailLoginMutateAsync({ email, password });

      setIsRedirecting(true);
      queryClient.clear();

      router.replace(isValidCallbackUrl(callbackUrl) ? callbackUrl : "/");
    } catch (error) {
      const errorCode = (error as AxiosError<ApiBaseResponseType<null>>).response?.data?.code;
      const toast = (errorCode && LOGIN_ERROR_TOAST[errorCode]) || LOGIN_ERROR_TOAST.COMMON500;
      addToast(toast.message, toast.type);
    }
  });

  const onSubmitLogin = (event?: BaseSyntheticEvent) => {
    if (isSubmittingRef.current || isPending || isRedirecting) {
      event?.preventDefault();
      return;
    }

    isSubmittingRef.current = true;

    void submitLogin(event).finally(() => {
      isSubmittingRef.current = false;
    });
  };

  return { onSubmitLogin, isPending: isPending || isRedirecting };
};

export default useAdminLoginForm;
