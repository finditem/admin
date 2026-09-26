import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { NoticeSaveRequest } from "../types/NoticeDraftType";

/**
 * 임시저장한 공지를 갱신한다. `draft: true`면 임시저장을 덮어쓰고,
 * `draft: false`면 그 공지를 발행하고 공지 목록으로 이동한다.
 */
export const usePutNoticeDraft = (draftId: number | null) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useAppMutation<NoticeSaveRequest, ApiBaseResponseType<string>>(
    "auth",
    `/admin/notices/${draftId}`,
    "put",
    {
      onSuccess: (_, { draft }) => {
        queryClient.invalidateQueries({ queryKey: ["notice-draft"] });

        if (draft) {
          addToast("임시저장했어요", "success");
          return;
        }

        queryClient.invalidateQueries({ queryKey: ["notices"] });
        addToast("공지사항이 등록되었습니다.", "success");
        router.replace("/admin/notice");
      },
      onError: (_, { draft }) => {
        addToast(draft ? "임시저장에 실패했어요" : "공지사항 등록에 실패했어요", "error");
      },
    }
  );
};
