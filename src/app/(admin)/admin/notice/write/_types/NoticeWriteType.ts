import { NoticeCategory } from "@/types";

export type NoticeCategoryFormValue = "" | NoticeCategory;

/** 새로 첨부한 이미지는 `file`이 있고, 임시저장본에서 불러온 이미지는 서버 URL만 있다. */
export interface NoticeWriteImageItem {
  file?: File;
  previewUrl: string;
}

export interface NoticeWriteFormValues {
  title: string;
  content: string;
  category: NoticeCategoryFormValue;
  images: NoticeWriteImageItem[];
}
