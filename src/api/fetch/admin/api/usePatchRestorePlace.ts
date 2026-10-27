import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { RestorePlaceResponse } from "../types/PlaceType";

export const usePatchRestorePlace = (placeId: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<void, RestorePlaceResponse>(
    "auth",
    `/admin/places/${placeId}/restore`,
    "patch",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-places"] });
        addToast("복구되었습니다", "success");
      },
      onError: () => {
        addToast("장소 복구에 실패했어요", "error");
      },
    }
  );
};
