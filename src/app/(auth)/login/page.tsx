import { AdminLoginFormProvider } from "./_components";
import { getSingleSearchParam } from "./_utils/getSingleSearchParam/getSingleSearchParam";

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { reason, callbackUrl } = await searchParams;

  return (
    <>
      <h1 className="sr-only">관리자 로그인</h1>

      <AdminLoginFormProvider
        reason={getSingleSearchParam(reason)}
        callbackUrl={getSingleSearchParam(callbackUrl)}
      />
    </>
  );
};

export default LoginPage;
