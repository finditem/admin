import { AxiosError } from "axios";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { getPlaceErrorMessage } from "../_utils/getPlaceErrorMessage/getPlaceErrorMessage";
import { DeletePlaceResponse } from "../types/PlaceType";

export const useDeletePlace = (placeId: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<void, DeletePlaceResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    `/admin/places/${placeId}`,
    "delete",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-places"] });
        addToast("삭제되었습니다", "success");
      },
      onError: (error) => {
        addToast(getPlaceErrorMessage(error, "장소 삭제에 실패했어요"), "error");
      },
    }
  );
};
