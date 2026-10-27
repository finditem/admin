import { DetailHeader, ScrollToTopButton } from "@/components";
import { AdminPlaceListView } from "./_components";

export const dynamic = "force-dynamic";

const page = () => {
  return (
    <>
      <DetailHeader title="성수 콘텐츠 관리" />
      <h1 className="sr-only">성수 콘텐츠 관리</h1>

      <AdminPlaceListView />

      <ScrollToTopButton className="fixed-button-position-bottom" />
    </>
  );
};

export default page;
