import { usePostNotices, usePutNoticeDraft } from "@/api/fetch/admin";
import { NoticeWriteFormValues } from "../_types/NoticeWriteType";
import { useUploadNoticeImages } from "./useUploadNoticeImages";

/**
 * 공지를 발행한다. 임시저장본을 이어 쓰는 중이면(`draftId`) 그 공지를 발행 상태로 바꾸고,
 * 아니면 새 공지를 만든다.
 */
const useSubmitNotice = (draftId: number | null) => {
  const { mutate: postNotice, isPending: isPosting } = usePostNotices();
  const { mutate: publishDraft, isPending: isPublishing } = usePutNoticeDraft(draftId);
  const { uploadImages, isUploading } = useUploadNoticeImages();

  const submitNotice = (data: NoticeWriteFormValues) => {
    const { images, category, ...rest } = data;

    uploadImages(images, (imageUrls, rollbackUploads) => {
      if (draftId) {
        publishDraft(
          { ...rest, category: category || undefined, imageUrls, draft: false },
          { onError: rollbackUploads }
        );
        return;
      }

      postNotice({ ...rest, category, imageUrls }, { onError: rollbackUploads });
    });
  };

  return { submitNotice, isPending: isPosting || isPublishing || isUploading };
};

export default useSubmitNotice;
