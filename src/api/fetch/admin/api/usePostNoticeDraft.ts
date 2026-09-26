import { useQueryClient } from "@tanstack/react-query";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { NoticeSaveRequest } from "../types/NoticeDraftType";

/** 공지를 처음 임시저장한다. 응답의 `result`가 새로 만들어진 공지 ID다. */
export const usePostNoticeDraft = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<NoticeSaveRequest & { draft: true }, ApiBaseResponseType<number>>(
    "auth",
    "/admin/notices",
    "post",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notice-draft"] });
        addToast("임시저장했어요", "success");
      },
      onError: () => {
        addToast("임시저장에 실패했어요", "error");
      },
    }
  );
};
