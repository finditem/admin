import { PlaceUpsertRequest, TimeRange } from "@/api/fetch/admin";
import { PlaceFormValues } from "../../_types/PlaceFormValues";

/**
 * 폼 입력값을 `POST`/`PUT /admin/places`가 받는 멀티파트 FormData로 바꾼다.
 * `request` 파트는 JSON 문자열(Blob)로, `thumbnail` 파트는 새로 고른 파일로 넣는다.
 * 수정에서 썸네일을 새로 고르지 않았으면 `thumbnail` 파트를 생략해 기존 썸네일을 유지한다.
 */
export const toPlaceUpsertFormData = (values: PlaceFormValues): FormData => {
  const weeklySchedules = values.weeklySchedules.map((schedule) => {
    const timeRanges: TimeRange[] = [];

    if (!schedule.isClosed) {
      timeRanges.push({
        type: "BUSINESS",
        startTime: schedule.businessStart,
        endTime: schedule.businessEnd,
      });

      if (schedule.hasBreak) {
        timeRanges.push({
          type: "BREAK_TIME",
          startTime: schedule.breakStart,
          endTime: schedule.breakEnd,
        });
      }
    } else {
      // 휴무일에도 timeRanges는 1개 이상 필요해 평소 영업시간을 그대로 전달한다.
      timeRanges.push({
        type: "BUSINESS",
        startTime: schedule.businessStart || "00:00",
        endTime: schedule.businessEnd || "00:00",
      });
    }

    return {
      dayOfWeek: schedule.dayOfWeek,
      isClosed: schedule.isClosed,
      timeRanges,
    };
  });

  const request: PlaceUpsertRequest = {
    name: values.name.trim(),
    nameEn: values.nameEn.trim() || undefined,
    address: values.address.trim(),
    addressEn: values.addressEn.trim() || undefined,
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    station: values.station.trim(),
    stationEn: values.stationEn.trim() || undefined,
    stationDistanceMeters: Number(values.stationDistanceMeters),
    type: values.type as PlaceUpsertRequest["type"],
    weeklySchedules,
    ...(values.type === "POPUP"
      ? {
          operationPeriod: {
            startDate: values.operationStartDate,
            endDate: values.operationEndDate,
          },
        }
      : {}),
  };

  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  if (values.thumbnail) {
    formData.append("thumbnail", values.thumbnail);
  }

  return formData;
};
