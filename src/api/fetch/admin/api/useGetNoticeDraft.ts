import useAppQuery from "@/api/_base/query/useAppQuery";
import { NoticeDraftResponse } from "../types/NoticeDraftType";

export const useGetNoticeDraft = () => {
  return useAppQuery<NoticeDraftResponse>("auth", ["notice-draft"], "/admin/notices/draft", {
    // 임시저장본이 없을 때 서버가 오류로 응답할 수 있으므로 재시도하지 않는다.
    retry: false,
    staleTime: 0,
  });
};
