"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { ConfirmModal, DetailHeader } from "@/components";
import { useGetNoticeDraft } from "@/api/fetch/admin";
import { NoticeWriteForm } from "./_components";
import { NoticeWriteFormValues } from "./_types/NoticeWriteType";
import { useSaveNoticeDraft } from "./_hooks/useSaveNoticeDraft";
import { toNoticeWriteFormValues } from "./_utils/toNoticeWriteFormValues";

const DEFAULT_VALUES: NoticeWriteFormValues = {
  title: "",
  content: "",
  category: "",
  images: [],
};

const NoticeWrite = () => {
  const methods = useForm<NoticeWriteFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [draftId, setDraftId] = useState<number | null>(null);
  const [isDraftPromptDismissed, setIsDraftPromptDismissed] = useState(false);

  const { data: draftData } = useGetNoticeDraft();
  const savedDraft = draftData?.result ?? null;
  const isDraftPromptOpen = Boolean(savedDraft) && draftId === null && !isDraftPromptDismissed;

  const { saveDraft, isSaving } = useSaveNoticeDraft({
    draftId,
    onSaved: (savedId, imageUrls) => {
      setDraftId(savedId);
      // 다시 저장할 때 같은 파일을 또 올리지 않도록, 올라간 URL로 바꿔 둔다.
      methods.setValue(
        "images",
        imageUrls.map((url) => ({ previewUrl: url }))
      );
    },
  });

  const [title, content] = useWatch({ control: methods.control, name: ["title", "content"] });
  // 서버가 임시저장에도 제목과 내용을 요구한다.
  const isDraftSaveDisabled = !title?.trim() || !content?.trim() || isSaving;

  const loadDraft = () => {
    if (!savedDraft) return;
    // reset은 필드 ref를 비우고 다시 렌더링될 때 register가 입력값을 채우게 두는데,
    // React Compiler가 register 호출을 메모이즈해 입력값이 비어 있게 된다. ref를 유지해 곧바로 채운다.
    methods.reset(toNoticeWriteFormValues(savedDraft), { keepFieldsRef: true });
    setDraftId(savedDraft.noticeId);
  };

  const dismissDraftPrompt = () => setIsDraftPromptDismissed(true);

  return (
    <>
      <DetailHeader title="공지사항 글쓰기">
        <button
          type="button"
          className="text-body1-semibold text-neutral-normal-default disabled:text-neutral-normal-placeholder"
          disabled={isDraftSaveDisabled}
          onClick={() => saveDraft(methods.getValues())}
        >
          임시저장
        </button>
      </DetailHeader>
      <h1 className="sr-only">공지사항 글쓰기 페이지</h1>
      <FormProvider<NoticeWriteFormValues> {...methods}>
        <NoticeWriteForm methods={methods} draftId={draftId} />
      </FormProvider>

      <ConfirmModal
        isOpen={isDraftPromptOpen}
        title="임시저장한 공지가 있어요"
        content="이어서 작성할까요?"
        confirmLabel="불러오기"
        onClose={dismissDraftPrompt}
        onCancel={dismissDraftPrompt}
        onConfirm={loadDraft}
        size="small"
      />
    </>
  );
};

export default NoticeWrite;
