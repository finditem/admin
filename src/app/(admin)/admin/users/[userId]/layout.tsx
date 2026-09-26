import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "유저 정보",
  other: { "page-type": "admin-user-detail" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default layout;
