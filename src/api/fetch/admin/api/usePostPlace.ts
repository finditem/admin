import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PostPlaceResponse } from "../types/PlaceType";

export const usePostPlace = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useAppMutation<FormData, PostPlaceResponse>("auth", "/admin/places", "post", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-places"] });
      addToast("장소가 등록되었습니다", "success");
      router.replace("/admin/places");
    },
    onError: () => {
      addToast("장소 등록에 실패했어요", "error");
    },
  });
};
