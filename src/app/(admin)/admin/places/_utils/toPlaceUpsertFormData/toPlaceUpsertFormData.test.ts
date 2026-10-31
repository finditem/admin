import { toPlaceUpsertFormData } from "./toPlaceUpsertFormData";
import { DEFAULT_PLACE_FORM_VALUES } from "../toPlaceFormDefaultValues";
import { PlaceFormValues, WeeklyScheduleFormValue } from "../../_types/PlaceFormValues";
import { PlaceUpsertRequest } from "@/api/fetch/admin";

const BASE_SCHEDULE: WeeklyScheduleFormValue = {
  dayOfWeek: "MONDAY",
  isClosed: false,
  businessStart: "10:00",
  businessEnd: "20:00",
  hasBreak: false,
  breakStart: "",
  breakEnd: "",
};

const BASE_VALUES: PlaceFormValues = {
  ...DEFAULT_PLACE_FORM_VALUES,
  type: "RESTAURANT",
  name: "  호호식당 성수  ",
  nameEn: "  Hoho  ",
  address: "서울 성동구 서울숲4길 25",
  addressEn: "",
  latitude: "37.1234",
  longitude: "127.1234",
  station: "성수역",
  stationEn: "",
  stationDistanceMeters: "400",
  weeklySchedules: DEFAULT_PLACE_FORM_VALUES.weeklySchedules.map((schedule) => ({
    ...schedule,
    ...BASE_SCHEDULE,
    dayOfWeek: schedule.dayOfWeek,
  })),
};

// jsdom의 Blob은 text()를 지원하지 않아 FileReader로 내용을 읽는다.
const readBlobAsText = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });

const parseRequestPart = async (formData: FormData): Promise<PlaceUpsertRequest> => {
  const requestPart = formData.get("request") as Blob;
  const text = await readBlobAsText(requestPart);
  return JSON.parse(text);
};

describe("toPlaceUpsertFormData", () => {
  it("문자열 필드를 trim하고 숫자 필드를 숫자로 변환한다", async () => {
    const formData = toPlaceUpsertFormData(BASE_VALUES);
    const request = await parseRequestPart(formData);

    expect(request.name).toBe("호호식당 성수");
    expect(request.nameEn).toBe("Hoho");
    expect(request.latitude).toBe(37.1234);
    expect(request.longitude).toBe(127.1234);
    expect(request.stationDistanceMeters).toBe(400);
  });

  it("빈 영문 필드는 undefined로 생략한다", async () => {
    const formData = toPlaceUpsertFormData({ ...BASE_VALUES, addressEn: "  ", stationEn: "" });
    const request = await parseRequestPart(formData);

    expect(request.addressEn).toBeUndefined();
    expect(request.stationEn).toBeUndefined();
  });

  it("휴무가 아닌 요일은 BUSINESS timeRange만 담는다", async () => {
    const formData = toPlaceUpsertFormData(BASE_VALUES);
    const request = await parseRequestPart(formData);

    const monday = request.weeklySchedules.find((schedule) => schedule.dayOfWeek === "MONDAY");
    expect(monday?.isClosed).toBe(false);
    expect(monday?.timeRanges).toEqual([
      { type: "BUSINESS", startTime: "10:00", endTime: "20:00" },
    ]);
  });

  it("휴식 시간이 있으면 BREAK_TIME timeRange를 추가한다", async () => {
    const values: PlaceFormValues = {
      ...BASE_VALUES,
      weeklySchedules: BASE_VALUES.weeklySchedules.map((schedule, index) =>
        index === 0
          ? { ...schedule, hasBreak: true, breakStart: "15:00", breakEnd: "16:00" }
          : schedule
      ),
    };

    const formData = toPlaceUpsertFormData(values);
    const request = await parseRequestPart(formData);

    expect(request.weeklySchedules[0].timeRanges).toEqual([
      { type: "BUSINESS", startTime: "10:00", endTime: "20:00" },
      { type: "BREAK_TIME", startTime: "15:00", endTime: "16:00" },
    ]);
  });

  it("휴무일은 isClosed만 true이고 timeRanges는 기존 영업시간을 그대로 담는다", async () => {
    const values: PlaceFormValues = {
      ...BASE_VALUES,
      weeklySchedules: BASE_VALUES.weeklySchedules.map((schedule, index) =>
        index === 0 ? { ...schedule, isClosed: true } : schedule
      ),
    };

    const formData = toPlaceUpsertFormData(values);
    const request = await parseRequestPart(formData);

    expect(request.weeklySchedules[0].isClosed).toBe(true);
    expect(request.weeklySchedules[0].timeRanges).toEqual([
      { type: "BUSINESS", startTime: "10:00", endTime: "20:00" },
    ]);
  });

  it("휴무이고 영업시간도 비어있으면 00:00으로 채운다", async () => {
    const values: PlaceFormValues = {
      ...BASE_VALUES,
      weeklySchedules: BASE_VALUES.weeklySchedules.map((schedule, index) =>
        index === 0 ? { ...schedule, isClosed: true, businessStart: "", businessEnd: "" } : schedule
      ),
    };

    const formData = toPlaceUpsertFormData(values);
    const request = await parseRequestPart(formData);

    expect(request.weeklySchedules[0].timeRanges).toEqual([
      { type: "BUSINESS", startTime: "00:00", endTime: "00:00" },
    ]);
  });

  it("POPUP 타입일 때만 operationPeriod를 포함한다", async () => {
    const popupValues: PlaceFormValues = {
      ...BASE_VALUES,
      type: "POPUP",
      operationStartDate: "2026-11-01",
      operationEndDate: "2026-11-30",
    };

    const popupRequest = await parseRequestPart(toPlaceUpsertFormData(popupValues));
    expect(popupRequest.operationPeriod).toEqual({
      startDate: "2026-11-01",
      endDate: "2026-11-30",
    });

    const restaurantRequest = await parseRequestPart(toPlaceUpsertFormData(BASE_VALUES));
    expect(restaurantRequest.operationPeriod).toBeUndefined();
  });

  it("새 썸네일 파일이 있으면 thumbnail 파트를 추가하고, 없으면 생략한다", async () => {
    const file = new File(["dummy"], "thumb.jpg", { type: "image/jpeg" });

    const withThumbnail = toPlaceUpsertFormData({ ...BASE_VALUES, thumbnail: file });
    expect(withThumbnail.get("thumbnail")).toBe(file);

    const withoutThumbnail = toPlaceUpsertFormData({ ...BASE_VALUES, thumbnail: null });
    expect(withoutThumbnail.get("thumbnail")).toBeNull();
  });
});
