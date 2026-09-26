import { DetailHeader } from "@/components";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { NoticeDeleteButton } from "./_components";

export const metadata: Metadata = {
  other: { "page-type": "admin-notice-write" },
};

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { id } = await params;

  return (
    <div className="h-base">
      <DetailHeader title="공지사항 수정">
        <NoticeDeleteButton noticeId={Number(id)} />
      </DetailHeader>
      <h1 className="sr-only">공지사항 수정 페이지</h1>
      {children}
    </div>
  );
};

export default Layout;
