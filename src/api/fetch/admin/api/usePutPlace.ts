import { AxiosError } from "axios";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { getPlaceErrorMessage } from "../_utils/getPlaceErrorMessage/getPlaceErrorMessage";
import { PutPlaceResponse } from "../types/PlaceType";

export const usePutPlace = (placeId: number) => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useAppMutation<FormData, PutPlaceResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    `/admin/places/${placeId}`,
    "put",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-places"] });
        queryClient.invalidateQueries({ queryKey: ["admin-place-detail", placeId] });
        addToast("장소가 수정되었습니다", "success");
        router.replace("/admin/places");
      },
      onError: (error) => {
        addToast(getPlaceErrorMessage(error, "장소 수정에 실패했어요"), "error");
      },
    }
  );
};
