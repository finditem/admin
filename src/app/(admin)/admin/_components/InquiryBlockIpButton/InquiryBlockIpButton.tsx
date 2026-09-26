"use client";

import { useState } from "react";
import { Button, ConfirmModal } from "@/components";
import { usePostInquiryBlockIp } from "@/api/fetch/admin";

interface InquiryBlockIpButtonProps {
  inquiryId: number;
  className?: string;
}

/** 문의를 보낸 IP를 차단 목록에 올리는 버튼과 확인 모달입니다. 회원·비회원 문의 상세에서 함께 씁니다. */
const InquiryBlockIpButton = ({ inquiryId, className }: InquiryBlockIpButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: blockIp, isPending } = usePostInquiryBlockIp(inquiryId);

  const close = () => setIsOpen(false);

  const confirmBlock = () => {
    blockIp({}, { onSettled: close });
  };

  return (
    <>
      <Button variant="outlined" className={className} onClick={() => setIsOpen(true)}>
        IP 차단하기
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        title="이 문의의 IP를 차단할까요?"
        content="차단한 IP에서는 더 이상 문의를 보낼 수 없어요."
        confirmLabel="차단"
        isPending={isPending}
        onClose={close}
        onCancel={close}
        onConfirm={confirmBlock}
        size="small"
      />
    </>
  );
};

export default InquiryBlockIpButton;
