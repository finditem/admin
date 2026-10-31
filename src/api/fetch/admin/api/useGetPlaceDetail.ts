import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetPlaceDetailResponse } from "../types/PlaceType";

export const useGetPlaceDetail = ({ placeId }: { placeId: number }) => {
  return useAppQuery<GetPlaceDetailResponse>(
    "auth",
    ["admin-place-detail", placeId],
    `/admin/places/${placeId}`
  );
};
