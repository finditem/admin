import Link from "next/link";
import { Icon, LoadingState } from "@/components";
import { AdminDetailSection, InquiryBlockIpButton } from "@/app/(admin)/admin/_components";
import AdminReportsCommentSection from "../AdminReportsCommentSection/AdminReportsCommentSection";
import { ReportsType } from "../../_types/ReportsType";
import { useReportsDetailQuery } from "../../_hooks/useReportsDetailQuery";
import { AdminDetailInquiry, AdminDetailReport, InquiryComments } from "@/api/fetch/admin";

interface AdminReportsViewProps {
  id: number;
  type: ReportsType;
  /** 목록에서 넘겨받은 신고자 또는 문의자 ID. 상세 URL로 바로 들어오면 없다. */
  userId: number | null;
}

const AdminReportsView = ({ id, type, userId }: AdminReportsViewProps) => {
  const { data, isLoading, isError } = useReportsDetailQuery({ id, type });

  if (isError) return null;

  let comments: InquiryComments[] = [];
  let inquiryIp: string | null = null;

  if (data?.result) {
    if (type === "inquiry") {
      const inquiryData = data.result as AdminDetailInquiry;
      comments = inquiryData.comments;
      inquiryIp = inquiryData.ip || null;
    } else if (type === "report") {
      const reportData = data.result as AdminDetailReport;

      if (reportData.answered) {
        comments = [
          {
            id: reportData.reportId,
            content: reportData.adminAnswer,
            authorId: reportData.adminId,
            authorName: reportData.adminNickname,
            profileImg: reportData.adminProfileImg,
            createdAt: reportData.answeredAt,
            imageList: reportData.answerImageList || [],
            admin: true,
          },
        ];
      }
    }
  }

  return (
    <div className="flex flex-col h-base">
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <AdminDetailSection data={data?.result} type={type} />
          {userId && (
            <Link
              href={`/admin/users/${userId}`}
              className="flex items-center justify-between border-b border-flatGray-50 px-5 py-4 text-body2-medium text-layout-header-default hover:bg-flatGray-25"
            >
              {type === "report" ? "신고자 정보 보기" : "문의자 정보 보기"}
              <Icon name="ArrowRightSmall" size={24} className="text-neutral-normal-default" />
            </Link>
          )}
          {type === "inquiry" && data?.result && (
            <section
              aria-label="문의 IP"
              className="flex items-center justify-between gap-3 border-b border-flatGray-50 px-5 py-4"
            >
              <p className="min-w-0 truncate text-body2-regular text-layout-body-default">
                IP {inquiryIp ?? "정보 없음"}
              </p>
              {inquiryIp && <InquiryBlockIpButton inquiryId={id} className="shrink-0" />}
            </section>
          )}
          <AdminReportsCommentSection comments={comments} />
        </>
      )}
    </div>
  );
};

export default AdminReportsView;
