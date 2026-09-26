import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useDeleteNotice = (noticeId: number) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const router = useRouter();

  return useAppMutation<void>("auth", `/admin/notices/${noticeId}`, "delete", {
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["notice-detail", noticeId] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      addToast("공지사항이 삭제되었어요", "success");
      router.replace("/admin/notice");
    },
    onError: () => {
      addToast("공지사항 삭제에 실패했어요", "error");
    },
  });
};
