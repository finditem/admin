import { useDeleteS3, usePostS3 } from "@/api/fetch/s3";
import { NoticeWriteImageItem } from "../_types/NoticeWriteType";

type OnImagesReady = (imageUrls: string[], rollbackUploads: () => void) => void;

/**
 * 공지 작성, 임시저장, 수정이 함께 쓰는 이미지 업로드 훅입니다.
 * 새로 첨부한 파일만 S3에 올리고, 이미 올라가 있던 URL과 합쳐 `onReady`에 넘깁니다.
 * 공지 저장이 실패하면 `rollbackUploads`를 불러 방금 올린 파일을 지웁니다.
 */
export const useUploadNoticeImages = () => {
  const { mutate: postS3, isPending: isUploading } = usePostS3();
  const { mutate: deleteS3 } = useDeleteS3();

  const uploadImages = (images: NoticeWriteImageItem[], onReady: OnImagesReady) => {
    const files = images
      .map((item) => item.file)
      .filter((file): file is File => file instanceof File);

    const existingUrls = images
      .filter((item) => !(item.file instanceof File))
      .map((item) => item.previewUrl)
      .filter((url) => Boolean(url) && !url.startsWith("blob:"));

    if (files.length === 0) {
      onReady(existingUrls, () => {});
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("image", file));

    postS3(formData, {
      onSuccess: ({ result }) => {
        const uploadedUrls = result ?? [];

        onReady([...existingUrls, ...uploadedUrls], () => {
          if (uploadedUrls.length > 0) deleteS3(uploadedUrls);
        });
      },
    });
  };

  return { uploadImages, isUploading };
};
