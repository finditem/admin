"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components";
import { cn } from "@/utils";
import { usePostGuestInquiryReply } from "@/api/fetch/admin";

const MAX_LENGTH = 2000;

interface GuestInquiryReplyFormProps {
  inquiryId: number;
  email: string;
}

/** 비회원 문의에 대한 답변을 작성해 문의자 이메일로 보내는 폼입니다. */
const GuestInquiryReplyForm = ({ inquiryId, email }: GuestInquiryReplyFormProps) => {
  const [content, setContent] = useState("");
  const { mutate: sendReply, isPending } = usePostGuestInquiryReply(inquiryId);

  const isSubmitDisabled = !content.trim() || isPending;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    sendReply({ content: content.trim() }, { onSuccess: () => setContent("") });
  };

  return (
    <form
      aria-labelledby="guest-inquiry-reply-title"
      className="flex flex-col gap-3 border-b border-flatGray-50 px-5 py-6"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <h2 id="guest-inquiry-reply-title" className="text-h3-semibold text-layout-header-default">
          이메일로 답변하기
        </h2>
        <p className="text-body2-regular text-layout-body-default">
          {email}으로 답변이 발송되고, 문의는 처리 완료로 바뀌어요.
        </p>
      </div>

      <div className="relative rounded-[10px] border border-neutral-normal-default px-4 pb-8 pt-3">
        <label htmlFor="guest-inquiry-reply" className="sr-only">
          답변 내용
        </label>
        <textarea
          id="guest-inquiry-reply"
          rows={6}
          value={content}
          maxLength={MAX_LENGTH}
          placeholder="답변 내용을 입력해 주세요."
          disabled={isPending}
          onChange={(e) => setContent(e.target.value)}
          className={cn(
            "w-full resize-none text-body1-medium text-neutral-normal-default",
            "placeholder:text-neutral-normal-placeholder focus:outline-none"
          )}
        />
        <span className="absolute bottom-3 right-4 text-body2-regular text-neutral-normal-placeholder">
          {content.length}/{MAX_LENGTH}
        </span>
      </div>

      <Button
        type="submit"
        className="min-h-11 w-full"
        disabled={isSubmitDisabled}
        loading={isPending}
      >
        답변 보내기
      </Button>
    </form>
  );
};

export default GuestInquiryReplyForm;
