import { NoticeDraft } from "@/api/fetch/admin";
import { NoticeWriteFormValues } from "../_types/NoticeWriteType";

export function toNoticeWriteFormValues(draft: NoticeDraft): NoticeWriteFormValues {
  return {
    title: draft.title ?? "",
    content: draft.content ?? "",
    category: draft.category ?? "",
    images: (draft.images ?? [])
      .filter((url): url is string => Boolean(url))
      .map((url) => ({ previewUrl: url })),
  };
}
