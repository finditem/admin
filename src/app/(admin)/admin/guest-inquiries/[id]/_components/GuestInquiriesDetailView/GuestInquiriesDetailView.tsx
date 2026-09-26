"use client";

import { Button, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { AdminDetailSection, InquiryBlockIpButton } from "@/app/(admin)/admin/_components";
import { useGetDetailGuestInquiries } from "@/api/fetch/admin";
import GuestInquiryReplyForm from "../GuestInquiryReplyForm/GuestInquiryReplyForm";

interface GuestInquiriesDetailViewProps {
  id: number;
}

const GuestInquiriesDetailView = ({ id }: GuestInquiriesDetailViewProps) => {
  const { addToast } = useToast();
  const { data, isLoading, isError } = useGetDetailGuestInquiries({ inquiryId: id });

  if (isLoading) return <LoadingState />;
  if (isError || !data?.result) return null;

  const copyEmail = () => {
    if (!data.result.email) {
      addToast("이메일이 존재하지 않아요", "error");
      return;
    }

    try {
      navigator.clipboard.writeText(data.result.email);
      addToast("이메일을 클립보드에 복사했어요", "success");
    } catch {
      addToast("이메일 복사에 실패했어요", "error");
    }
  };

  return (
    <div className="flex flex-col h-base">
      <article className="flex-1">
        <AdminDetailSection data={data.result} type="inquiry" isGuest={true} />

        {data.result.answered ? (
          <p className="border-b border-flatGray-50 px-5 py-6 text-body2-regular text-layout-body-default">
            답변을 보낸 문의예요.
          </p>
        ) : (
          <GuestInquiryReplyForm inquiryId={id} email={data.result.email} />
        )}
      </article>

      <div className="sticky bottom-0 flex gap-2 border-t border-divider-default bg-white px-5 pb-8 pt-3">
        <Button variant="outlined" className="min-h-11 flex-1" onClick={copyEmail}>
          이메일 복사하기
        </Button>
        <InquiryBlockIpButton inquiryId={id} className="min-h-11 flex-1" />
      </div>
    </div>
  );
};

export default GuestInquiriesDetailView;
