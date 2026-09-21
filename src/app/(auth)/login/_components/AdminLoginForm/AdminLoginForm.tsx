"use client";

import { Button, Icon, InputText } from "@/components";
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

/**
 * 관리자 로그인 폼입니다.
 *
 * @remarks
 * - 상위에서 `FormProvider`로 감싸야 합니다.
 * - 회원가입과 비밀번호 찾기는 운영 앱에서만 제공하므로 링크를 두지 않습니다.
 */

const AdminLoginForm = () => {
  const { onSubmitLogin, isPending } = useAdminLoginForm();
  useLoginReasonToast();

  return (
    <form onSubmit={onSubmitLogin}>
      <div className="flex min-h-dvh w-full gap-12 px-4 py-[64px] flex-col-center tablet:px-[80px]">
        <div className="flex w-full flex-col items-center gap-10">
          <Icon name="Logo" size={120} title="찾아줘! 관리자" />

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
