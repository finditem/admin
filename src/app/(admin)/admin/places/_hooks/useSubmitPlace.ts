import { usePostPlace, usePutPlace } from "@/api/fetch/admin";
import { PlaceFormValues } from "../_types/PlaceFormValues";
import { toPlaceUpsertFormData } from "../_utils/toPlaceUpsertFormData/toPlaceUpsertFormData";

/** 등록(placeId 없음) 또는 수정(placeId 있음)을 같은 폼에서 처리한다. */
export const useSubmitPlace = (placeId: number | null) => {
  const { mutate: postPlace, isPending: isPosting } = usePostPlace();
  const { mutate: putPlace, isPending: isPutting } = usePutPlace(placeId ?? 0);

  const submitPlace = (values: PlaceFormValues) => {
    const formData = toPlaceUpsertFormData(values);

    if (placeId) {
      putPlace(formData);
      return;
    }

    postPlace(formData);
  };

  return { submitPlace, isPending: isPosting || isPutting };
};
