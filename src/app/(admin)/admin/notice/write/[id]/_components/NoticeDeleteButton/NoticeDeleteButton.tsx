"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components";
import { useDeleteNotice } from "@/api/fetch/admin";

interface NoticeDeleteButtonProps {
  noticeId: number;
}

/** 공지 수정 화면 헤더에 두는 삭제 버튼과 확인 모달입니다. 삭제에 성공하면 공지 목록으로 이동합니다. */
const NoticeDeleteButton = ({ noticeId }: NoticeDeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteNotice, isPending } = useDeleteNotice(noticeId);

  const close = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className="text-body1-semibold text-system-warning"
        onClick={() => setIsOpen(true)}
      >
        삭제
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="공지사항을 삭제할까요?"
        content="삭제한 공지사항은 되돌릴 수 없어요."
        confirmLabel="삭제"
        isPending={isPending}
        onClose={close}
        onCancel={close}
        onConfirm={() => deleteNotice(undefined, { onError: close })}
        size="small"
      />
    </>
  );
};

export default NoticeDeleteButton;
