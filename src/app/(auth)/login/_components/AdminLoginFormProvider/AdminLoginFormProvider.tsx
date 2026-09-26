"use client";
"use no memo";

import { FormProvider, useForm } from "react-hook-form";
import { AdminLoginFormType } from "../../_types/AdminLoginFormType";
import AdminLoginForm from "../AdminLoginForm/AdminLoginForm";

interface AdminLoginFormProviderProps {
  /** 로그인 화면으로 보내진 이유(`reason` 쿼리) */
  reason?: string;
  /** 로그인 후 돌아갈 경로(`callbackUrl` 쿼리) */
  callbackUrl?: string;
}

/**
 * 관리자 로그인 폼의 `react-hook-form` 상태를 만들고 폼에 내려줍니다.
 *
 * @remarks
 * - 페이지가 서버 컴포넌트라 폼 상태를 이 클라이언트 컴포넌트에서 만듭니다.
 */

export const AdminLoginFormProvider = ({ reason, callbackUrl }: AdminLoginFormProviderProps) => {
  const methods = useForm<AdminLoginFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <AdminLoginForm reason={reason} callbackUrl={callbackUrl} />
    </FormProvider>
  );
};
