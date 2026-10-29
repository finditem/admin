import { PlaceManagementResult } from "@/api/fetch/admin";
import { DAY_OF_WEEK_OPTIONS } from "../_constants/DAY_OF_WEEK_OPTIONS";
import { PlaceFormValues, WeeklyScheduleFormValue } from "../_types/PlaceFormValues";

const EMPTY_WEEKLY_SCHEDULES: WeeklyScheduleFormValue[] = DAY_OF_WEEK_OPTIONS.map(({ value }) => ({
  dayOfWeek: value,
  isClosed: false,
  businessStart: "",
  businessEnd: "",
  hasBreak: false,
  breakStart: "",
  breakEnd: "",
}));

export const DEFAULT_PLACE_FORM_VALUES: PlaceFormValues = {
  type: "",
  name: "",
  nameEn: "",
  address: "",
  addressEn: "",
  latitude: "",
  longitude: "",
  station: "",
  stationEn: "",
  stationDistanceMeters: "",
  weeklySchedules: EMPTY_WEEKLY_SCHEDULES,
  operationStartDate: "",
  operationEndDate: "",
  thumbnail: null,
  existingThumbnailUrl: "",
};

/** 장소 상세 조회 응답을 수정 폼 기본값으로 바꾼다. */
export const toPlaceFormDefaultValues = (place: PlaceManagementResult): PlaceFormValues => {
  const weeklySchedules = DAY_OF_WEEK_OPTIONS.map(({ value }) => {
    const schedule = place.weeklySchedules.find((item) => item.dayOfWeek === value);
    const business = schedule?.timeRanges.find((range) => range.type === "BUSINESS");
    const breakTime = schedule?.timeRanges.find((range) => range.type === "BREAK_TIME");

    return {
      dayOfWeek: value,
      isClosed: schedule?.isClosed ?? false,
      businessStart: business?.startTime ?? "",
      businessEnd: business?.endTime ?? "",
      hasBreak: Boolean(breakTime),
      breakStart: breakTime?.startTime ?? "",
      breakEnd: breakTime?.endTime ?? "",
    };
  });

  return {
    type: place.type,
    name: place.name,
    nameEn: place.nameEn ?? "",
    address: place.address,
    addressEn: place.addressEn ?? "",
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    station: place.station,
    stationEn: place.stationEn ?? "",
    stationDistanceMeters: String(place.stationDistanceMeters),
    weeklySchedules,
    operationStartDate: place.operationPeriod?.startDate ?? "",
    operationEndDate: place.operationPeriod?.endDate ?? "",
    thumbnail: null,
    existingThumbnailUrl: place.thumbnailUrl,
  };
};
