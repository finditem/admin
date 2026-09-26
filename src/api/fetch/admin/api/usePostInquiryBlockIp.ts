import { AxiosError } from "axios";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

interface InquiryBlockIpRequest {
  reason?: string;
}

export const usePostInquiryBlockIp = (inquiryId: number) => {
  const { addToast } = useToast();

  return useAppMutation<
    InquiryBlockIpRequest,
    ApiBaseResponseType<string>,
    AxiosError<ApiBaseResponseType<null>>
  >("auth", `/admin/inquiries/${inquiryId}/block-ip`, "post", {
    onSuccess: () => {
      addToast("이 문의의 IP를 차단했어요", "success");
    },
    onError: (error) => {
      // 409는 이미 차단 목록에 있는 IP라는 뜻이다.
      if (error.response?.status === 409) {
        addToast("이미 차단된 IP예요", "warning");
        return;
      }
      addToast("IP 차단에 실패했어요", "error");
    },
  });
};
