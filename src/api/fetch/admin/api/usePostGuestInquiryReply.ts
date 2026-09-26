import { useQueryClient } from "@tanstack/react-query";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

interface GuestInquiryReplyRequest {
  content: string;
}

export const usePostGuestInquiryReply = (inquiryId: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<GuestInquiryReplyRequest, ApiBaseResponseType<string>>(
    "auth",
    `/admin/guest-inquiries/${inquiryId}/reply`,
    "post",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["guest-inquiries-detail", inquiryId] });
        queryClient.invalidateQueries({ queryKey: ["guest-inquiries"] });
        addToast("답변을 이메일로 보냈어요", "success");
      },
      onError: () => {
        addToast("답변 발송에 실패했어요", "error");
      },
    }
  );
};
