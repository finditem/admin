"use client";

import { Button, InputText } from "@/components";
import Logo from "@/assets/logo.svg";
import useAdminLoginForm from "../../_hooks/useAdminLoginForm";
import useLoginReasonToast from "../../_hooks/useLoginReasonToast";

const LOGIN_INPUTS = [
  {
    inputOption: {
      name: "email",
      type: "text",
      placeholder: "이메일을 입력해 주세요",
      validation: { required: true },
    },
    label: "아이디(이메일)",
  },
  {
    inputOption: {
      name: "password",
      type: "password",
      placeholder: "비밀번호를 입력해 주세요",
      validation: { required: true },
    },
    label: "비밀번호",
  },
] as const;

interface AdminLoginFormProps {
  /** 로그인 화면으로 보내진 이유(`reason` 쿼리) */
  reason?: string;
  /** 로그인 후 돌아갈 경로(`callbackUrl` 쿼리) */
  callbackUrl?: string;
}

/**
 * 관리자 로그인 폼입니다.
 *
 * @remarks
 * - 상위에서 `FormProvider`로 감싸야 합니다.
 * - 회원가입과 비밀번호 찾기는 운영 앱에서만 제공하므로 링크를 두지 않습니다.
 * - 로고는 첫 화면에 바로 보여야 하므로 `Icon`의 지연 로딩을 거치지 않고 정적으로 가져옵니다.
 */

const AdminLoginForm = ({ reason, callbackUrl }: AdminLoginFormProps) => {
  const { onSubmitLogin, isPending } = useAdminLoginForm(callbackUrl);
  useLoginReasonToast(reason);

  return (
    <form onSubmit={onSubmitLogin}>
      <div className="flex min-h-dvh w-full gap-12 px-4 py-[64px] flex-col-center tablet:px-[80px] pc:mx-auto pc:max-w-[480px] pc:px-0">
        <div className="flex w-full flex-col items-center gap-10">
          <Logo width={120} height={120} role="img" aria-label="찾아줘! 관리자" />

          <fieldset className="flex w-full flex-col gap-3">
            <legend className="sr-only">로그인 정보 입력</legend>
            {LOGIN_INPUTS.map((item) => (
              <InputText key={item.inputOption.name} {...item} />
            ))}
          </fieldset>
        </div>

        <Button type="submit" variant="auth" loading={isPending}>
          로그인
        </Button>
      </div>
    </form>
  );
};

export default AdminLoginForm;
