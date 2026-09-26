"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { NoticeWriteFormValues } from "../../_types/NoticeWriteType";
import { TitleInput, ContentInput, CategoryInput } from "./_internal";
import { WriteImageSection, WriteActionSection } from "@/components";
import useSubmitNotice from "../../_hooks/useSubmitNotice";

const IMAGE_HELP_TEXT = "*사진은 최대 5장 첨부가 가능합니다. (선택)";

const canSubmit = (values: NoticeWriteFormValues): boolean =>
  Boolean(values.title?.trim() && values.category && values.content?.trim());

interface NoticeWriteFormProps {
  methods: UseFormReturn<NoticeWriteFormValues>;
  /** 임시저장본을 이어 쓰는 중이면 그 공지 ID. 발행할 때 새로 만들지 않고 이 공지를 발행한다. */
  draftId: number | null;
}

const NoticeWriteForm = ({ methods, draftId }: NoticeWriteFormProps) => {
  const values = useWatch({ control: methods.control });
  const { submitNotice, isPending } = useSubmitNotice(draftId);
  const isSubmitDisabled = !canSubmit(values as NoticeWriteFormValues) || isPending;

  const onSubmit = (data: NoticeWriteFormValues) => submitNotice(data);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-base">
      <TitleInput />
      <CategoryInput />
      <ContentInput />
      <WriteImageSection helpText={IMAGE_HELP_TEXT} />
      <div className="sticky bottom-0 w-full max-w-[764px] border-t border-divider-default bg-white pc:max-w-none">
        <WriteActionSection disabled={isSubmitDisabled} />
      </div>
    </form>
  );
};

export default NoticeWriteForm;
