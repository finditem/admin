import { redirect } from "next/navigation";
import { DetailHeader } from "@/components";
import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import AnalyticsDashboard from "../_components/AnalyticsDashboard/AnalyticsDashboard";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const hasToken = await hasValidToken();
  if (!hasToken) redirect("/login");

  const { range } = await searchParams;

  return (
    <div className="min-h-dvh">
      <DetailHeader title="서비스 통계" />
      <h1 className="sr-only">서비스 통계</h1>

      <AnalyticsDashboard rangeParam={range} basePath="/admin/analytics" />
    </div>
  );
};

export default page;
