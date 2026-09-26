import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import { AdminMenuSection, AdminProfile } from "./_components";
import AnalyticsDashboard from "./_components/AnalyticsDashboard/AnalyticsDashboard";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const hasToken = await hasValidToken();
  if (!hasToken) redirect("/login");

  const { range } = await searchParams;

  return (
    <div className="h-base">
      <h1 className="sr-only">관리자 페이지</h1>

      <div className="pc:hidden">
        <AdminProfile />
        <AdminMenuSection />
      </div>

      {/* PC에서는 사이드바가 메뉴를 맡으므로 메인에 서비스 통계를 바로 보여준다. */}
      <section aria-labelledby="admin-main-analytics-title" className="hidden pc:block">
        <h2
          id="admin-main-analytics-title"
          className="px-5 pt-[30px] text-h2-bold text-layout-header-default"
        >
          서비스 통계
        </h2>
        <AnalyticsDashboard rangeParam={range} basePath="/admin" />
      </section>
    </div>
  );
};

export default page;
