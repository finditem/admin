import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 통계",
  other: { "page-type": "admin-analytics" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default layout;
