import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지사항 글쓰기",
};

const layout = ({ children }: { children: ReactNode }) => children;

export default layout;
