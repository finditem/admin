import { usePutNoticeDetail } from "@/api/fetch/admin";
import { useUploadNoticeImages } from "../../_hooks/useUploadNoticeImages";
import { NoticeEditFormValues } from "../_types/NoticeEditFormValues";

interface UseSubmitNoticeEditParams {
  noticeId: number;
}

export const useSubmitNoticeEdit = ({ noticeId }: UseSubmitNoticeEditParams) => {
  const { mutate: putNotice, isPending } = usePutNoticeDetail(noticeId);
  const { uploadImages } = useUploadNoticeImages();

  const submitNoticeEdit = (data: NoticeEditFormValues) => {
    const { images, ...rest } = data;

    uploadImages(images, (imageUrls, rollbackUploads) => {
      putNotice({ ...rest, imageUrls }, { onError: rollbackUploads });
    });
  };

  return { submitNoticeEdit, isPending };
};
