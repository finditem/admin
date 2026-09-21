/** `WriteImageSection`이 `useFieldArray`로 다루는 이미지 항목입니다. */
export interface WriteImageItem {
  id?: number;
  file?: File;
  previewUrl: string;
}

/** `WriteImageSection`을 쓰는 폼이 가져야 하는 필드입니다. */
export interface WriteImageFormValues {
  images: WriteImageItem[];
}
