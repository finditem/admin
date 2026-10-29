import { PlaceCategory } from "@/api/fetch/admin";

export type PlaceTypeFilter = PlaceCategory | "";

export const PLACE_TYPE_OPTIONS: { label: string; value: PlaceTypeFilter }[] = [
  { label: "전체", value: "" },
  { label: "카페", value: "CAFE" },
  { label: "맛집", value: "RESTAURANT" },
  { label: "팝업", value: "POPUP" },
];
