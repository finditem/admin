import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import { AdminMenuSection, AdminProfile } from "./_components";
import { redirect } from "next/navigation";

const page = async () => {
  const hasToken = await hasValidToken();
  if (!hasToken) redirect("/login");

  return (
    <div className="h-base">
      <h1 className="sr-only">관리자 페이지</h1>

      <div className="pc:hidden">
        <AdminProfile />
        <AdminMenuSection />
      </div>

      <p className="hidden py-[160px] text-body1-regular text-layout-body-default pc:flex-center">
        왼쪽 메뉴에서 관리할 항목을 선택해 주세요.
      </p>
    </div>
  );
};

export default page;
