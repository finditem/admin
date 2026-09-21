import type { Metadata } from "next";
import NotFoundView from "@/components/state/NotFoundView/NotFoundView";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
};

const NotFound = () => {
  return <NotFoundView />;
};

export default NotFound;
