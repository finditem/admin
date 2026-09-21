"use client";
"use no memo";

import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AdminLoginForm } from "./_components";
import { AdminLoginFormType } from "./_types/AdminLoginFormType";

const LoginPage = () => {
  const methods = useForm<AdminLoginFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <>
      <h1 className="sr-only">관리자 로그인</h1>

      <FormProvider {...methods}>
        <Suspense>
          <AdminLoginForm />
        </Suspense>
      </FormProvider>
    </>
  );
};

export default LoginPage;
