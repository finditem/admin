import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DB 조회",
  other: { "page-type": "admin-db" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default layout;
