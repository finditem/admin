import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useApiLogout } from "@/api/fetch/auth";

/**
 * 로그아웃 API를 호출하고 쿼리 캐시를 비운 뒤 로그인 화면으로 이동하는 훅입니다.
 *
 * @remarks
 * - 로그아웃 요청 중이거나 이동 중일 때는 중복 호출을 무시합니다.
 * - 실패하면 에러 토스트를 띄우고 현재 화면에 머뭅니다.
 *
 * @example
 * ```tsx
 * const { handleLogout, isPending } = useLogout();
 * ```
 */

const useLogout = () => {
  const { mutateAsync: logoutMutateAsync, isPending } = useApiLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { addToast } = useToast();

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    if (isLoggingOut || isPending || isRedirecting) return;
    setIsLoggingOut(true);

    void (async () => {
      try {
        await logoutMutateAsync();

        setIsRedirecting(true);
        queryClient.clear();
        addToast("로그아웃 되었어요.", "success");
        router.replace("/login");
      } catch {
        addToast("로그아웃에 실패했어요. 다시 시도해주세요.", "error");
      } finally {
        setIsLoggingOut(false);
      }
    })();
  };

  return { handleLogout, isPending: isPending || isLoggingOut || isRedirecting };
};

export default useLogout;
