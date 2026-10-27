import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PutPlaceResponse } from "../types/PlaceType";

export const usePutPlace = (placeId: number) => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useAppMutation<FormData, PutPlaceResponse>("auth", `/admin/places/${placeId}`, "put", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-places"] });
      queryClient.invalidateQueries({ queryKey: ["admin-place-detail", placeId] });
      addToast("장소가 수정되었습니다", "success");
      router.replace("/admin/places");
    },
    onError: () => {
      addToast("장소 수정에 실패했어요", "error");
    },
  });
};
