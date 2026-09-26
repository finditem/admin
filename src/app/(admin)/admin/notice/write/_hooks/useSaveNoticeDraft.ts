import { usePostNoticeDraft, usePutNoticeDraft } from "@/api/fetch/admin";
import { NoticeWriteFormValues } from "../_types/NoticeWriteType";
import { useUploadNoticeImages } from "./useUploadNoticeImages";

interface UseSaveNoticeDraftParams {
  /** 이미 저장한 임시저장본 ID. 없으면 처음 저장할 때 새로 만든다. */
  draftId: number | null;
  /** 저장에 성공하면 임시저장본 ID와 서버에 올라간 이미지 URL 목록을 넘긴다. */
  onSaved: (draftId: number, imageUrls: string[]) => void;
}

export const useSaveNoticeDraft = ({ draftId, onSaved }: UseSaveNoticeDraftParams) => {
  const { mutate: postDraft, isPending: isPosting } = usePostNoticeDraft();
  const { mutate: putDraft, isPending: isPutting } = usePutNoticeDraft(draftId);
  const { uploadImages, isUploading } = useUploadNoticeImages();

  const saveDraft = (data: NoticeWriteFormValues) => {
    const { images, category, ...rest } = data;

    uploadImages(images, (imageUrls, rollbackUploads) => {
      // 분류는 임시저장 단계에서 비어 있을 수 있다. 빈 문자열은 서버 enum에 없으므로 보내지 않는다.
      const body = { ...rest, category: category || undefined, imageUrls, draft: true as const };

      if (draftId) {
        putDraft(body, { onSuccess: () => onSaved(draftId, imageUrls), onError: rollbackUploads });
        return;
      }

      postDraft(body, {
        onSuccess: ({ result }) => onSaved(result, imageUrls),
        onError: rollbackUploads,
      });
    });
  };

  return { saveDraft, isSaving: isPosting || isPutting || isUploading };
};
