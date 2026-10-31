import { PlaceSummaryForAdmin } from "@/api/fetch/admin";

/**
 * 공개 API(GET /places, dev-api.finditem.kr)에서 실제로 노출 중인 성수 콘텐츠를 가져와 만든 mock이다.
 * nameEn, createdAt은 공개 API에 없어 임의로 채웠다. 실제 관리자용 목록 API가 생기면 교체한다.
 */
export const MOCK_ADMIN_PLACE_LIST: PlaceSummaryForAdmin[] = [
  {
    placeId: 15,
    name: "올리브영N 성수",
    nameEn: null,
    type: "POPUP",
    address: "서울 성동구 연무장7길 13",
    thumbnailUrl:
      "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/thumb_3b4df9c1-6_POPUP-003.jpg",
    stationDistanceMeters: 220,
    createdAt: "2026-10-20T11:00:00",
  },
  {
    placeId: 12,
    name: "조스티아 가든 성수",
    nameEn: null,
    type: "RESTAURANT",
    address: "서울 성동구 연무장5가길 7",
    thumbnailUrl:
      "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/thumb_0b74a4af-1_REST-006.jpg",
    stationDistanceMeters: 180,
    createdAt: "2026-10-15T09:30:00",
  },
  {
    placeId: 11,
    name: "호호식당 성수",
    nameEn: null,
    type: "RESTAURANT",
    address: "서울 성동구 서울숲4길 25",
    thumbnailUrl:
      "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/thumb_33f80a6a-a_REST-005.jpg",
    stationDistanceMeters: 400,
    createdAt: "2026-10-10T14:20:00",
  },
  {
    placeId: 10,
    name: "중화가정 성수점",
    nameEn: null,
    type: "RESTAURANT",
    address: "서울 성동구 성수이로 69",
    thumbnailUrl:
      "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/thumb_873864a3-c_REST-004.jpg",
    stationDistanceMeters: 250,
    createdAt: "2026-10-05T16:40:00",
  },
  {
    placeId: 9,
    name: "제스티살룬 성수",
    nameEn: null,
    type: "RESTAURANT",
    address: "서울 성동구 서울숲2길 13",
    thumbnailUrl:
      "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/thumb_1d0ec1af-8_REST-003.jpg",
    stationDistanceMeters: 450,
    createdAt: "2026-09-28T10:10:00",
  },
];
