import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { NoticeCategory } from "@/types";

export interface NoticeDraft {
  noticeId: number;
  title: string;
  content: string;
  category: NoticeCategory | null;
  pinned: boolean;
  images: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeDraftResponse extends ApiBaseResponseType<NoticeDraft | null> {}

export interface NoticeSaveRequest {
  title: string;
  content: string;
  category?: NoticeCategory;
  imageUrls: string[];
  draft: boolean;
}
