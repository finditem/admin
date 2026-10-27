import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export type PlaceCategory = "CAFE" | "RESTAURANT" | "POPUP";

export type DayOfWeek =
  "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type TimeRangeType = "BUSINESS" | "BREAK_TIME";

export interface TimeRange {
  type: TimeRangeType;
  startTime: string;
  endTime: string;
}

export interface WeeklySchedule {
  dayOfWeek: DayOfWeek;
  isClosed: boolean;
  timeRanges: TimeRange[];
}

export interface OperationPeriod {
  startDate: string;
  endDate: string;
}

export interface PlaceUpsertRequest {
  name: string;
  nameEn?: string;
  address: string;
  addressEn?: string;
  latitude: number;
  longitude: number;
  station: string;
  stationEn?: string;
  stationDistanceMeters: number;
  type: PlaceCategory;
  weeklySchedules: WeeklySchedule[];
  operationPeriod?: OperationPeriod;
}

export interface PlaceManagementResult {
  placeId: number;
  name: string;
  nameEn: string | null;
  type: PlaceCategory;
  address: string;
  addressEn: string | null;
  latitude: number;
  longitude: number;
  station: string;
  stationEn: string | null;
  stationDistanceMeters: number;
  thumbnailUrl: string;
  operationPeriod: OperationPeriod | null;
  weeklySchedules: WeeklySchedule[];
}

export interface PlaceIdResult {
  placeId: number;
}

export interface PostPlaceResponse extends ApiBaseResponseType<PlaceManagementResult> {}
export interface GetPlaceDetailResponse extends ApiBaseResponseType<PlaceManagementResult> {}
export interface PutPlaceResponse extends ApiBaseResponseType<PlaceManagementResult> {}
export interface DeletePlaceResponse extends ApiBaseResponseType<PlaceIdResult> {}
export interface RestorePlaceResponse extends ApiBaseResponseType<PlaceIdResult> {}

// 아래는 backend-api-assumptions.md의 가정 스펙 기준. 백엔드 실제 API가 나오면 함께 확인한다.
export interface PlaceSummaryForAdmin {
  placeId: number;
  name: string;
  nameEn: string | null;
  type: PlaceCategory;
  address: string;
  thumbnailUrl: string;
  stationDistanceMeters: number;
  createdAt: string;
}

export interface GetAdminPlacesResult {
  content: PlaceSummaryForAdmin[];
  hasNext: boolean;
  nextCursor: string | null;
}

export interface GetAdminPlacesResponse extends ApiBaseResponseType<GetAdminPlacesResult> {}

export interface DeletedPlaceSummaryForAdmin extends PlaceSummaryForAdmin {
  deletedAt: string;
}

export interface GetDeletedAdminPlacesResult {
  content: DeletedPlaceSummaryForAdmin[];
  hasNext: boolean;
  nextCursor: string | null;
}

export interface GetDeletedAdminPlacesResponse extends ApiBaseResponseType<GetDeletedAdminPlacesResult> {}
